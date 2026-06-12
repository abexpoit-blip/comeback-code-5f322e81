#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER="${DB_CONTAINER:-$(docker ps --filter name=supabase-db --format '{{.Names}}' | head -n 1)}"

if [ -z "$DB_CONTAINER" ]; then
  echo "❌ Could not find the database container (expected a name matching supabase-db)."
  echo "   Try: DB_CONTAINER=<your-db-container-name> bash scripts/vps-ensure-maintenance-db.sh"
  exit 1
fi

echo "--- Ensuring maintenance DB objects in container: $DB_CONTAINER ---"

docker exec -i "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 <<'SQL'
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_cron;

ALTER TABLE public.clicks ADD COLUMN IF NOT EXISTS device TEXT;

CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  human_clicks INTEGER NOT NULL DEFAULT 0,
  bot_clicks INTEGER NOT NULL DEFAULT 0,
  country_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  device_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(link_id, day)
);

ALTER TABLE public.daily_stats ADD COLUMN IF NOT EXISTS country_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.daily_stats ADD COLUMN IF NOT EXISTS device_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    GRANT SELECT ON public.daily_stats TO anon;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    GRANT SELECT ON public.daily_stats TO authenticated;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT ALL ON public.daily_stats TO service_role;
  END IF;
END $$;

ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'daily_stats'
      AND policyname = 'Anyone can view daily stats'
  ) THEN
    CREATE POLICY "Anyone can view daily stats"
      ON public.daily_stats
      FOR SELECT
      USING (true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_last_hour_click_stats()
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'humans', COUNT(*) FILTER (WHERE is_bot = false),
    'bots', COUNT(*) FILTER (WHERE is_bot = true),
    'offer', COUNT(*) FILTER (WHERE routed_to = 'offer'),
    'fb_article', COUNT(*) FILTER (WHERE routed_to = 'fb-article'),
    'safe', COUNT(*) FILTER (WHERE routed_to = 'safe'),
    'ours', COUNT(*) FILTER (WHERE routed_to = 'ours'),
    'fb', COUNT(*) FILTER (WHERE routed_to = 'fb')
  )
  FROM public.clicks
  WHERE created_at >= now() - interval '1 hour';
$function$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION public.get_last_hour_click_stats() TO service_role;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.maintenance_purge_old_clicks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.daily_stats (link_id, day, human_clicks, bot_clicks, country_breakdown, device_breakdown)
  SELECT
    daily.link_id,
    daily.day,
    daily.human_clicks,
    daily.bot_clicks,
    COALESCE(countries.country_breakdown, '{}'::jsonb),
    COALESCE(devices.device_breakdown, '{}'::jsonb)
  FROM (
    SELECT
      link_id,
      created_at::date AS day,
      COUNT(*) FILTER (WHERE is_bot = false) AS human_clicks,
      COUNT(*) FILTER (WHERE is_bot = true) AS bot_clicks
    FROM public.clicks
    WHERE created_at < now()::date
    GROUP BY link_id, created_at::date
  ) daily
  LEFT JOIN LATERAL (
    SELECT jsonb_object_agg(country, cnt) AS country_breakdown
    FROM (
      SELECT country, COUNT(*)::int AS cnt
      FROM public.clicks c
      WHERE c.link_id = daily.link_id
        AND c.created_at::date = daily.day
        AND c.country IS NOT NULL
      GROUP BY country
    ) grouped_country
  ) countries ON true
  LEFT JOIN LATERAL (
    SELECT jsonb_object_agg(device, cnt) AS device_breakdown
    FROM (
      SELECT device, COUNT(*)::int AS cnt
      FROM public.clicks c
      WHERE c.link_id = daily.link_id
        AND c.created_at::date = daily.day
        AND c.device IS NOT NULL
      GROUP BY device
    ) grouped_device
  ) devices ON true
  ON CONFLICT (link_id, day) DO UPDATE SET
    human_clicks = EXCLUDED.human_clicks,
    bot_clicks = EXCLUDED.bot_clicks,
    country_breakdown = EXCLUDED.country_breakdown,
    device_breakdown = EXCLUDED.device_breakdown;

  DELETE FROM public.clicks
  WHERE created_at < (now() - interval '7 days');

  IF to_regclass('public.error_logs') IS NOT NULL THEN
    DELETE FROM public.error_logs
    WHERE created_at < (now() - interval '30 days');
  END IF;
END;
$function$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    GRANT EXECUTE ON FUNCTION public.maintenance_purge_old_clicks() TO authenticated;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION public.maintenance_purge_old_clicks() TO service_role;
  END IF;
END $$;

SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname IN ('weekly-click-purge', 'weekly-purge-old-clicks');

SELECT cron.schedule(
  'weekly-purge-old-clicks',
  '0 3 * * 0',
  $$ SELECT public.maintenance_purge_old_clicks(); $$
)
WHERE NOT EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'weekly-purge-old-clicks'
);

NOTIFY pgrst, 'reload schema';

SELECT
  to_regclass('public.daily_stats') IS NOT NULL AS daily_stats_exists,
  to_regprocedure('public.maintenance_purge_old_clicks()') IS NOT NULL AS maintenance_fn_exists;

SELECT public.maintenance_purge_old_clicks();

SELECT jobname, schedule, active
FROM cron.job
WHERE jobname = 'weekly-purge-old-clicks';

SELECT
  pg_size_pretty(pg_database_size(current_database())) AS db_size,
  (SELECT COUNT(*) FROM public.clicks) AS clicks_remaining,
  (SELECT COUNT(*) FROM public.daily_stats) AS aggregated_days;
SQL

echo "✅ Maintenance DB repair completed"
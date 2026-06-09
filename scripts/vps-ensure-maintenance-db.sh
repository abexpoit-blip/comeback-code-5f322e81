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

GRANT SELECT ON public.daily_stats TO anon, authenticated;
GRANT ALL ON public.daily_stats TO service_role;

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

CREATE OR REPLACE FUNCTION public.maintenance_purge_old_clicks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.daily_stats (link_id, day, human_clicks, bot_clicks, country_breakdown, device_breakdown)
  SELECT
    link_id,
    created_at::date AS day,
    COUNT(*) FILTER (WHERE is_bot = false) AS humans,
    COUNT(*) FILTER (WHERE is_bot = true) AS bots,
    jsonb_object_agg(country, count_val) FILTER (WHERE country IS NOT NULL) AS countries,
    jsonb_object_agg(device, count_device) FILTER (WHERE device IS NOT NULL) AS devices
  FROM (
    SELECT
      link_id,
      created_at::date,
      is_bot,
      country,
      COUNT(*) OVER (PARTITION BY link_id, created_at::date, country) AS count_val,
      device,
      COUNT(*) OVER (PARTITION BY link_id, created_at::date, device) AS count_device
    FROM public.clicks
    WHERE created_at < now()::date
  ) sub
  GROUP BY link_id, created_at::date
  ON CONFLICT (link_id, day) DO UPDATE SET
    human_clicks = EXCLUDED.human_clicks,
    bot_clicks = EXCLUDED.bot_clicks,
    country_breakdown = EXCLUDED.country_breakdown,
    device_breakdown = EXCLUDED.device_breakdown;

  DELETE FROM public.clicks
  WHERE created_at < (now() - interval '7 days');

  DELETE FROM public.error_logs
  WHERE created_at < (now() - interval '30 days');
END;
$function$;

GRANT EXECUTE ON FUNCTION public.maintenance_purge_old_clicks() TO authenticated;
GRANT EXECUTE ON FUNCTION public.maintenance_purge_old_clicks() TO service_role;

PERFORM cron.unschedule(jobid)
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
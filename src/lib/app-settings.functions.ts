import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAppSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    // Use admin client for bypass RLS on system-wide settings
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("app_settings")
      .select("*")
      .eq("id", true)
      .maybeSingle();
    
    if (error) {
      console.error("[app-settings] fetch failed:", error.message);
      throw new Error(error.message);
    }
    return data;
  });

export const updateAppSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      fallback_url: z.string().url(),
      our_adsterra_url: z.string().url(),
      injection_threshold: z.number().int().min(100).max(1_000_000),
      injection_count: z.number().int().min(1).max(10_000),
      daily_redirect_enabled: z.boolean(),
      support_enabled: z.boolean().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    // SECURITY: Use service role client for admin operations
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Explicit admin check
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    
    if (!roleRow) {
      console.error("[app-settings] unauthorized update attempt by", context.userId);
      throw new Error("Admin only");
    }

    const { error } = await supabaseAdmin
      .from("app_settings")
      .update(data as any)
      .eq("id", true);

    if (error) {
      console.error("[app-settings] update failed:", error.message);
      throw new Error(error.message);
    }

    // Success
    return { ok: true };
  });

/**
 * Daily auto-redirect: returns the fallback URL the FIRST time the user
 * hits the dashboard each calendar day (UTC). Subsequent calls same day → null.
 */
export const consumeDailyRedirect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Use admin client to ensure settings are always readable
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const { data: settings } = await supabaseAdmin
      .from("app_settings")
      .select("fallback_url, daily_redirect_enabled")
      .eq("id", true)
      .maybeSingle();

    if (!settings || !settings.daily_redirect_enabled) return { url: null as string | null };

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("last_daily_redirect_at")
      .eq("id", context.userId)
      .single();

    const last = profile?.last_daily_redirect_at ? new Date(profile.last_daily_redirect_at) : null;
    const now = new Date();
    const sameUTCDay =
      !!last &&
      last.getUTCFullYear() === now.getUTCFullYear() &&
      last.getUTCMonth() === now.getUTCMonth() &&
      last.getUTCDate() === now.getUTCDate();

    if (sameUTCDay) return { url: null as string | null };

    await supabaseAdmin
      .from("profiles")
      .update({ last_daily_redirect_at: now.toISOString() })
      .eq("id", context.userId);

    return { url: settings.fallback_url as string };
  });

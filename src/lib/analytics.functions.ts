import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  loadAnalyticsData,
  loadCohortRetention,
  loadLinkDrilldown,
  loadLiveFeed,
} from "@/lib/analytics.server";

export const getAnalyticsData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return loadAnalyticsData(context);
  });

export const getCohortRetention = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return loadCohortRetention(context);
  });

export const getLinkDrilldown = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ linkId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    return loadLinkDrilldown({ ...context, linkId: data.linkId });
  });

export const getLiveFeed = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return loadLiveFeed(context);
  });

import { createServerFn } from "@tanstack/react-start";
import { loadAnalyticsData } from "@/lib/analytics.server";
import { getRequestAuth } from "@/lib/request-auth.server";
import { checkPaidAccess } from "@/lib/plan-gate.server";

export const getAnalyticsData = createServerFn({ method: "GET" })
  .handler(async () => {
    const context = await getRequestAuth();
    const gate = await checkPaidAccess(context.supabase, context.userId);
    if (!gate.allowed) {
      return { locked: true as const, plan: gate.plan };
    }
    const data = await loadAnalyticsData(context);
    return { locked: false as const, plan: gate.plan, data };
  });

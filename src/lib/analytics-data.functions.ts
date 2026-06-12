import { createServerFn } from "@tanstack/react-start";
import { loadAnalyticsData } from "@/lib/analytics.server";
import { getRequestAuth } from "@/lib/request-auth.server";

export const getAnalyticsData = createServerFn({ method: "GET" })
  .handler(async () => {
    const context = await getRequestAuth();
    return loadAnalyticsData(context);
  });
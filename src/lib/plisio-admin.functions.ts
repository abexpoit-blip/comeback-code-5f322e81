import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const adminListPlisioLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    
    const { data: logs, error } = await supabaseAdmin
      .from("plisio_event_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
      
    if (error) throw new Error(error.message);

    // Fetch user emails for the logs that have an order_number (which is the upgrade_request id)
    const orderIds = Array.from(new Set((logs ?? [])
      .map(l => l.order_number)
      .filter(id => id && id.length > 20))); // Basic UUID check

    if (orderIds.length > 0) {
      const { data: requests } = await supabaseAdmin
        .from("upgrade_requests")
        .select("id, user_id")
        .in("id", orderIds);
      
      const userIds = Array.from(new Set((requests ?? []).map(r => r.user_id)));
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("id, email")
          .in("id", userIds);
          
        const emailMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.email]));
        const orderToUserMap = Object.fromEntries((requests ?? []).map(r => [r.id, r.user_id]));

        return (logs ?? []).map(l => ({
          ...l,
          user_email: l.order_number ? emailMap[orderToUserMap[l.order_number] || ""] : "Unknown"
        }));
      }
    }

    return logs;
  });


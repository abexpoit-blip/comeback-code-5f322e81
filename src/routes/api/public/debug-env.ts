import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/debug-env")({
  server: {
    handlers: {
      GET: async () => {
        const hasUrl = !!process.env.SUPABASE_URL;
        const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        const hasPlisio = !!process.env.PLISIO_API_KEY;
        
        return new Response(JSON.stringify({
          SUPABASE_URL: hasUrl,
          SUPABASE_SERVICE_ROLE_KEY: hasKey,
          PLISIO_API_KEY: hasPlisio,
          NODE_ENV: process.env.NODE_ENV,
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  }
});

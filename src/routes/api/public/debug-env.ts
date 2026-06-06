import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/debug-env")({
  server: {
    handlers: {
      GET: async () => {
        const hasUrl = !!process.env.SUPABASE_URL;
        const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        const hasPlisio = !!process.env.PLISIO_API_KEY;
        const keys = Object.keys(process.env).filter(k => !k.includes("KEY") && !k.includes("SECRET") && !k.includes("PASS"));
        
        return new Response(JSON.stringify({
          SUPABASE_URL: hasUrl,
          SUPABASE_SERVICE_ROLE_KEY: hasKey,
          PLISIO_API_KEY: hasPlisio,
          NODE_ENV: process.env.NODE_ENV,
          ENV_KEYS: keys,
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  }
});

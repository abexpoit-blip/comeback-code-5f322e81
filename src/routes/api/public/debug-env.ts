import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug-env")({
  beforeLoad: () => {
    // try to bypass any potential redirects in middleware if this is actually being redirected
  },
  server: {
    handlers: {
      GET: async () => {
        const hasUrl = !!process.env.SUPABASE_URL;
        const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        const hasPlisio = !!process.env.PLISIO_API_KEY;
        const keys = Object.keys(process.env).filter(k => !k.includes("KEY") && !k.includes("SECRET") && !k.includes("PASS"));
        
        return new Response(`SUPABASE_URL: ${hasUrl}\nSUPABASE_SERVICE_ROLE_KEY: ${hasKey}\nPLISIO_API_KEY: ${hasPlisio}\nNODE_ENV: ${process.env.NODE_ENV}\nENV_KEYS: ${keys.join(", ")}`, {
          headers: { "Content-Type": "text/plain" }
        });
      }
    }
  }
});


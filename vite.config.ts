import { defineConfig } from "@lovable.dev/vite-tanstack-config";
const appBuildVersion = process.env.APP_BUILD_VERSION || process.env.GIT_COMMIT_SHA || `${Date.now()}`;
export default defineConfig({
  nitro: { preset: "node-server" },
  tanstackStart: { server: { entry: "server" } },
  vite: {
    define: { __APP_BUILD_VERSION__: JSON.stringify(appBuildVersion) },
    preview: { host: "0.0.0.0", port: 3000, allowedHosts: ["sleepox.com", "75.119.144.171"] },
    server: { host: "0.0.0.0", allowedHosts: ["sleepox.com", "75.119.144.171"] },
    build: {
      // Split heavy vendors into separate cacheable chunks so the main bundle
      // stays small and the browser can parallelize downloads.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            if (id.includes("/react/") || id.includes("/react-dom/")) return "vendor-react";
            if (id.includes("/@tanstack/react-query/")) return "vendor-query";
            if (
              id.includes("/@supabase/supabase-js/") ||
              id.includes("/@supabase/auth-js/") ||
              id.includes("/@supabase/postgrest-js/") ||
              id.includes("/@supabase/realtime-js/") ||
              id.includes("/@supabase/storage-js/")
            ) return "vendor-supabase";
            if (id.includes("/recharts/")) return "vendor-charts";
            if (id.includes("/lucide-react/")) return "vendor-icons";
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
  },
});

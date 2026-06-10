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
          manualChunks: {
            "vendor-react": ["react", "react-dom"],
            "vendor-router": ["@tanstack/react-router", "@tanstack/react-start", "@tanstack/router-core"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-supabase": ["@supabase/supabase-js", "@supabase/auth-js", "@supabase/postgrest-js", "@supabase/realtime-js", "@supabase/storage-js"],
            "vendor-charts": ["recharts", "d3-shape", "d3-scale", "d3-array", "d3-time", "d3-time-format", "d3-format", "d3-color", "d3-interpolate", "d3-path", "victory-vendor"],
            "vendor-icons": ["lucide-react"],
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
  },
});

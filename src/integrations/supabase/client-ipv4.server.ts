import { createClient } from "@supabase/supabase-js";

import { fetchIpv4 } from "@/lib/fetch-ipv4";

import type { Database } from "./types";

function createSupabaseAdminIpv4Client() {
  const supabaseUrl = process.env.SUPABASE_URL || "https://supabase.sleepox.com";
  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Nzk1MjczMzgsImV4cCI6MjA5NDg4NzMzOH0.HitgT1rO3FH8h4jNpbvhaBfrLFkGz_JN91c1caB2O_8";

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: fetchIpv4,
    },
  });
}

let _supabaseAdminIpv4: ReturnType<typeof createSupabaseAdminIpv4Client> | undefined;

export const supabaseAdminIpv4 = new Proxy({} as ReturnType<typeof createSupabaseAdminIpv4Client>, {
  get(_, prop, receiver) {
    if (!_supabaseAdminIpv4) _supabaseAdminIpv4 = createSupabaseAdminIpv4Client();
    return Reflect.get(_supabaseAdminIpv4, prop, receiver);
  },
});
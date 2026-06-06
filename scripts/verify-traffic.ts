import { createClient } from '@supabase/supabase-js';

// Configuration for your self-hosted database
const SUPABASE_URL = "https://supabase.sleepox.com";
// We use the service role key from ecosystem.config.cjs
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTUyNzMzOCwiZXhwIjoyMDk0ODg3MzM4fQ.HitgT1rO3FH8h4jNpbvhaBfrLFkGz_JN91c1caB2O_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function verifyTraffic() {
  console.log("🔍 Verifying Live Traffic Stats on https://supabase.sleepox.com...");
  
  const { count: clickCount, error: clickError } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true });

  if (clickError) {
    console.error("❌ Error fetching clicks:", clickError.message);
  } else {
    console.log(`📈 Total clicks found: ${clickCount}`);
  }

  const { data: links, error: linkError } = await supabase
    .from('links')
    .select('id, short_code, clicks_count')
    .order('clicks_count', { ascending: false })
    .limit(5);

  if (linkError) {
    console.error("❌ Error fetching links:", linkError.message);
  } else {
    console.log("\n--- Top 5 Links ---");
    links.forEach(l => console.log(`🔗 ${l.short_code}: ${l.clicks_count} clicks`));
  }
}

verifyTraffic();
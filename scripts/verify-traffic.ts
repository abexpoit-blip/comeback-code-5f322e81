import { createClient } from '@supabase/supabase-js';

// Configuration for your self-hosted database
const SUPABASE_URL = "https://supabase.sleepox.com";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTUyNzMzOCwiZXhwIjoyMDk0ODg3MzM4fQ.HitgT1rO3FH8h4jNpbvhaBfrLFkGz_JN91c1caB2O_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyTraffic() {
  console.log("🔍 Verifying Live Traffic Stats on https://supabase.sleepox.com...");
  
  const { data: links, error } = await supabase
    .from('links')
    .select('id, short_code, clicks_count, ours_clicks_count, offer_clicks_count')
    .order('clicks_count', { ascending: false })
    .limit(10);

  if (error) {
    console.error("❌ Error fetching links:", error.message);
    // Fallback check
    const { count: clickCount, error: clickError } = await supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true });
    
    if (clickError) {
      console.error("❌ Error fetching clicks table:", clickError.message);
    } else {
      console.log(`📈 Total clicks found in database: ${clickCount}`);
    }
    return;
  }

  console.log("\n--- Top 10 Links Stats ---");
  links.forEach(link => {
    console.log(`🔗 ${link.short_code}:`);
    console.log(`   Total Clicks: ${link.clicks_count}`);
    console.log(`   Ours: ${link.ours_clicks_count}`);
    console.log(`   Offer: ${link.offer_clicks_count}`);
  });
}

verifyTraffic();
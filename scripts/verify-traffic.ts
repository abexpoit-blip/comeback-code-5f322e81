import { createClient } from '@supabase/supabase-js';

// Configuration for checking the database directly
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyTraffic() {
  console.log("🔍 Verifying Live Traffic Stats...");
  
  const { data: links, error } = await supabase
    .from('links')
    .select('id, short_code, clicks_count, ours_clicks_count, offer_clicks_count')
    .order('clicks_count', { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ Error fetching links:", error.message);
    return;
  }

  console.log("\n--- Top 5 Links Stats ---");
  links.forEach(link => {
    console.log(`🔗 ${link.short_code}:`);
    console.log(`   Total Clicks: ${link.clicks_count}`);
    console.log(`   Ours: ${link.ours_clicks_count}`);
    console.log(`   Offer: ${link.offer_clicks_count}`);
  });

  const { count: recentClicks, error: clickError } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .gt('created_at', new Date(Date.now() - 3600000).toISOString()); // Last 1 hour

  if (clickError) {
    console.error("❌ Error fetching recent clicks:", clickError.message);
  } else {
    console.log(`\n📈 Traffic in last hour: ${recentClicks || 0} clicks`);
  }
}

verifyTraffic();

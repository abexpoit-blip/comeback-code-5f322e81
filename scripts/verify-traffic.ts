import { supabase } from "./src/integrations/supabase/client";

async function verifyTraffic() {
  console.log("🔍 Verifying Live Traffic Stats...");
  
  const { data: links, error } = await supabase
    .from('links')
    .select('id, slug, clicks_count, ours_clicks_count, offer_clicks_count')
    .order('clicks_count', { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ Error fetching links:", error.message);
    return;
  }

  console.log("\n--- Top 5 Links Stats ---");
  links.forEach(link => {
    console.log(`🔗 ${link.slug}:`);
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
    console.log(`\n📈 Traffic in last hour: ${recentClicks} clicks`);
  }
}

verifyTraffic();

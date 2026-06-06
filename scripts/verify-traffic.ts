import { createClient } from '@supabase/supabase-js';

// USING ANON KEY TO TEST ACCESS
const SUPABASE_URL = "https://supabase.sleepox.com";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5NTI3MzM4LCJleHAiOjIwOTQ4ODczMzh9.URbRlYz0AjLehmGhVH7dnsfwJPUY_zgYC4hodpxeHW8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyTraffic() {
  console.log("🔍 Verifying Live Traffic Stats on https://supabase.sleepox.com...");
  
  const { data: links, error } = await supabase
    .from('links')
    .select('id, short_code, clicks_count, ours_clicks_count, offer_clicks_count')
    .order('clicks_count', { ascending: false })
    .limit(10);

  if (error) {
    console.error("❌ Error fetching links:", error.message);
    // If links fail, try checking clicks table directly
    const { count: cCount, error: cErr } = await supabase.from('clicks').select('*', { count: 'exact', head: true });
    if (cErr) console.error("❌ Error fetching clicks:", cErr.message);
    else console.log(`📈 Total clicks found: ${cCount}`);
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

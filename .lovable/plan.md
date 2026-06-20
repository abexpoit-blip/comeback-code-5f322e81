
## সমস্যা ও কী ঠিক করব

### 1. Analytics-এ Devices / OS / Top Performing Links / Bot Reasons / Traffic Sources না দেখানোর আসল কারণ

`migration/18_analytics_cache_and_index_cleanup.sql` ভুলবশত `_compute_analytics_summary()` কে এমন একটা সংক্ষিপ্ত version দিয়ে replace করেছে যেটা **শুধু** `links / total / humans / bots / hourly / heatmap / countries / browsers / liveEvents` রিটার্ন করে।

ফলে এই ৫টা field RPC থেকে আর আসে না (frontend `undefined` পায় → empty section):
- `devices`
- `operatingSystems`
- `botReasons`
- `trafficSources`
- `topLinks`

এমনকি `browsers`-ও broken — raw `ua` string দিয়ে group করছে, parsed browser name দিয়ে না।

`analytics_cache` টেবিলে ২ মিনিট TTL-এ এই broken payload cache হয়ে আছে — তাই নতুন code দিয়ে fix করলেও cache flush দরকার।

### 2. লোডিং স্লো ও ল্যাগি কেন

প্রথম cache-miss-এ `_compute_analytics_summary` এখনো ~১০–২০ সেকেন্ড নেয় (২ মিনিটে এক বার)। 2 → 5 মিনিট TTL করলে cache hit rate বাড়বে। Cohort retention + live feed-ও ৫ মিনিট cache পাবে।

### 3. Plan gating

| Feature | এখন | চাই |
|---|---|---|
| Analytics (পুরো পেজ + cohort + drilldown) | সবার জন্য open | শুধু paid: `monthly` / `pro_monthly` / `pro` / `lifetime` / `unlimited` / `yearly` |
| Link Debugger | আগেই paid-only | কোনো change নেই |
| Custom Domains | যেকোনো paid plan | শুধু `lifetime` / `unlimited` |

---

## কী কী change হবে

### A. New migration `migration/22_restore_full_analytics_compute.sql`
1. `_compute_analytics_summary` কে migration 10-এর সম্পূর্ণ version দিয়ে replace — devices, browsers (parsed), OS, bot reasons, traffic sources, top links সব আবার return হবে।
2. `get_analytics_summary` cache TTL: 2 min → **5 min**।
3. `TRUNCATE public.analytics_cache` — পুরোনো broken payload মুছে যাবে; পরবর্তী fetch নতুন data বানাবে।
4. `NOTIFY pgrst, 'reload schema';`

### B. Server functions (plan gate add)
নতুন helper `src/lib/plan-gate.server.ts`:
```ts
export async function getUserPlan(supabase, userId): "free"|"monthly"|"lifetime"|...
export async function assertAnalyticsAccess(supabase, userId)  // paid only
export async function assertLifetimeAccess(supabase, userId)   // lifetime/unlimited only
```

আপডেট:
- `src/lib/analytics-data.functions.ts` → `getAnalyticsData` শুরুতে `assertAnalyticsAccess`। Locked হলে `{ locked: true, plan }` return।
- `src/lib/cohort-retention.functions.ts` → same gate।
- `src/lib/link-drilldown.functions.ts` → same gate।
- `src/lib/custom-domains.functions.ts` → `PAID_PLANS` কে `LIFETIME_PLANS = {"lifetime","unlimited"}` এ change; error message: "Custom Domains is a Lifetime-only feature."

### C. Frontend
- `src/routes/_authenticated/analytics.tsx` → response-এ `locked` থাকলে orange "Analytics — Pro feature" paywall card দেখাও + Upgrade button। (link-debugger পেজে যে style-এর paywall আছে সেটাই reuse pattern।)
- `src/routes/_authenticated/domains.tsx` → "Pro feature" copy বদলে "Lifetime-only feature" করা হবে।

### D. Technical notes
- কোনো client.ts / auth-middleware.ts / types.ts touch করব না।
- নতুন server function module pattern follow করব (`*.server.ts` helper, dynamic admin import দরকার নেই)।
- Analytics route public route না — `_authenticated/` এর under, তাই loader-এ call ঠিক আছে।

---

## ডিপ্লয় (একটানে কপি-পেস্ট)

DB migration আগে apply, তারপর code deploy:

```bash
cd /opt/sleepox-app-new && \
docker exec -i supabase-db psql -U postgres -d postgres < migration/22_restore_full_analytics_compute.sql && \
git pull && bun install && pm2 stop all && bun run build && pm2 start all && \
pm2 logs --lines 30 --nostream
```

Verify (Analytics page reload করে দেখবেন devices/OS/top links সব দেখাচ্ছে):

```bash
docker exec -i supabase-db psql -U postgres -d postgres -c "
SELECT proname,
  CASE WHEN prosrc LIKE '%v_devices%' AND prosrc LIKE '%v_top_links%'
       THEN 'FULL ✓' ELSE 'STILL STRIPPED ✗' END AS status
FROM pg_proc WHERE proname='_compute_analytics_summary';
SELECT COUNT(*) cached_users FROM analytics_cache;
"
```

---

## ⚠️ একটা confirmation

এই plan অনুযায়ী **Free user analytics দেখতে পাবে না** (Upgrade card দেখবে)। যদি চান free user **basic** analytics দেখতে পারবে কিন্তু কিছু advanced section (cohort, drilldown, top links) lock থাকবে — সেটা বললে সেই অনুযায়ী আবার plan করব।

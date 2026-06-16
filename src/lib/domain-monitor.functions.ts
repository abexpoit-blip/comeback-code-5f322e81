import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

function normDomain(input: string): string {
  let d = (input || "").trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "").split("/")[0].split("?")[0].split("#")[0].split(":")[0];
  return d;
}

function domainFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.toLowerCase();
  } catch { return null; }
}

// ---- List ----
export const listMonitoredDomains = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("monitored_domains")
      .select("*")
      .order("status", { ascending: true, nullsFirst: false })
      .order("domain", { ascending: true });
    if (error) throw new Error(error.message);
    return { domains: data || [] };
  });

// ---- Add manual ----
export const addMonitoredDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { domain: string; notes?: string }) =>
    z.object({ domain: z.string().min(3), notes: z.string().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const domain = normDomain(data.domain);
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) throw new Error("Invalid domain");
    const { error } = await supabaseAdmin
      .from("monitored_domains")
      .upsert({ domain, source: "manual", notes: data.notes || null, is_active: true } as any,
              { onConflict: "domain" });
    if (error) throw new Error(error.message);
    return { ok: true, domain };
  });

// ---- Toggle / delete ----
export const toggleMonitoredDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; is_active: boolean }) =>
    z.object({ id: z.string().uuid(), is_active: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("monitored_domains").update({ is_active: data.is_active } as any).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMonitoredDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("monitored_domains").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---- Sync from links.destination_url ----
export const syncOfferDomainsFromLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: links, error } = await supabaseAdmin
      .from("links").select("destination_url").eq("is_active", true);
    if (error) throw new Error(error.message);
    const set = new Set<string>();
    for (const l of links || []) {
      const d = domainFromUrl((l as any).destination_url);
      if (d) set.add(d);
    }
    const rows = [...set].map((domain) => ({ domain, source: "auto", is_active: true }));
    if (rows.length === 0) return { ok: true, added: 0, total: 0 };
    // Upsert, but don't downgrade manual entries
    const { error: upErr } = await supabaseAdmin
      .from("monitored_domains")
      .upsert(rows as any, { onConflict: "domain", ignoreDuplicates: true });
    if (upErr) throw new Error(upErr.message);
    return { ok: true, total: rows.length };
  });

// ---- Persist a result ----
async function saveCheckResult(domainId: string, domain: string, r: any) {
  await supabaseAdmin.from("domain_health_checks").insert({
    domain_id: domainId, domain,
    status: r.status,
    ssl_valid: r.ssl_valid, ssl_expires_at: r.ssl_expires_at,
    ssl_days_remaining: r.ssl_days_remaining, ssl_issuer: r.ssl_issuer,
    dns_ok: r.dns_ok, http_status: r.http_status,
    http_final_url: r.http_final_url, redirect_count: r.redirect_count,
    blacklisted: r.blacklisted, blacklist_sources: r.blacklist_sources,
    error_message: r.error_message, raw: r.raw,
  } as any);
  await supabaseAdmin.from("monitored_domains").update({
    status: r.status,
    ssl_valid: r.ssl_valid, ssl_expires_at: r.ssl_expires_at,
    ssl_days_remaining: r.ssl_days_remaining, ssl_issuer: r.ssl_issuer,
    dns_ok: r.dns_ok, http_status: r.http_status,
    http_final_url: r.http_final_url, redirect_count: r.redirect_count,
    blacklisted: r.blacklisted, blacklist_sources: r.blacklist_sources,
    last_checked_at: new Date().toISOString(),
    last_error: r.error_message,
  } as any).eq("id", domainId);
}

// ---- Scan a single domain (manual button) ----
export const scanMonitoredDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("monitored_domains").select("id, domain").eq("id", data.id).maybeSingle();
    if (error || !row) throw new Error(error?.message || "Not found");
    const { runDomainHealthCheck } = await loadHealth();
    const r = await runDomainHealthCheck((row as any).domain);
    await saveCheckResult((row as any).id, (row as any).domain, r);
    // Avoid returning raw (unknown-typed jsonb) over RPC — not serializable-typed
    const { raw: _raw, ...safe } = r;
    return { ok: true, result: safe };
  });

// ---- Scan all active domains (used by cron + admin "Scan all" button) ----
export const scanAllMonitoredDomains = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    return await scanAllInternal();
  });

export async function scanAllInternal() {
  const { data: rows, error } = await supabaseAdmin
    .from("monitored_domains").select("id, domain").eq("is_active", true);
  if (error) throw new Error(error.message);
  if (!rows || rows.length === 0) return { ok: true, scanned: 0 };
  const { runDomainHealthCheck } = await import(/* @vite-ignore */ "./domain-health.server");

  // Process in small batches to avoid hammering DNS / sockets
  const BATCH = 5;
  let scanned = 0;
  let critical = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const slice = rows.slice(i, i + BATCH);
    const results = await Promise.allSettled(slice.map(async (r: any) => {
      const res = await runDomainHealthCheck(r.domain);
      await saveCheckResult(r.id, r.domain, res);
      return res.status;
    }));
    for (const x of results) {
      if (x.status === "fulfilled") {
        scanned++;
        if (x.value === "critical") critical++;
      }
    }
  }
  return { ok: true, scanned, critical };
}

// ---- History for one domain (last 30) ----
export const getDomainHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: rows, error } = await supabaseAdmin
      .from("domain_health_checks")
      .select("*")
      .eq("domain_id", data.id)
      .order("checked_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return { history: rows || [] };
  });

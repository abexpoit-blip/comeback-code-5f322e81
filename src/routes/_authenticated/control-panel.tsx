import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Users, Link2, MousePointerClick, Sparkles, Settings2, ShieldCheck, CreditCard, Bot,
  Target, Zap, Calendar, DollarSign, TrendingUp, Globe, Package, Ban, RotateCcw, Trash2,
  Plus, Search, X, Eye, Check, Star, RefreshCw, LifeBuoy, Megaphone, MessageCircle,
  Send, Power, PowerOff, Clock, CheckCircle2, Crown, Gift, AlertTriangle, Info, Rocket, Trophy, KeyRound,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  adminStats, adminListUsers, adminBanUser, adminBulkBan, adminResetUserQuota, adminBulkSetPlan,
  adminListPackages, adminListAllPackages, adminUpsertPackage, adminDeletePackage,
  adminSetUserPlan, adminListUpgradeRequests, adminDecideUpgradeRequest,
  adminClicksTimeseries, adminTopCountries, adminTopUsers, adminRevenueTimeseries,
  adminListLinks, adminToggleLink, adminUpdateLink, adminDeleteLink,
  adminListBotRules, adminUpsertBotRule, adminDeleteBotRule,
  adminListCloakingRules, adminUpsertCloakingRule, adminDeleteCloakingRule,
  adminListCountryTiers, adminUpsertCountryTier, adminDeleteCountryTier,
  adminUserDetail, adminImpersonate,
  adminListErrors, adminErrorStats, adminResolveError, adminDeleteError, adminClearResolvedErrors,
  adminGetInactiveUsers, adminRunMaintenance, adminDeleteUsers
} from "@/lib/admin.functions";
import { startImpersonation } from "@/lib/impersonation";
import { getAppSettings, updateAppSettings } from "@/lib/app-settings.functions";
import {
  listShortenerDomains, addShortenerDomain, verifyShortenerDomain,
  setPrimaryShortenerDomain, toggleShortenerDomainActive, deleteShortenerDomain,
} from "@/lib/shortener-domains.functions";
import {
  getSupportStatus, toggleSupport, adminListTickets, adminReplyTicket,
  adminCloseTicket, adminDeleteTicket,
} from "@/lib/support.functions";
import {
  adminListBroadcasts, adminCreateBroadcast, adminToggleBroadcast, adminDeleteBroadcast,
} from "@/lib/broadcasts.functions";

export const Route = createFileRoute("/_authenticated/control-panel")({
  head: () => ({ meta: [{ title: "Control Panel — Sleepox" }] }),
  component: AdminPage,
});

const font = { fontFamily: "'Outfit', system-ui, sans-serif" } as const;
const PIE_COLORS = ["#FF7E5F", "#FEB47B", "#FFD4BB", "#7A5C45", "#FFEDD5", "#2D1B0D", "#4A3728", "#A8907A"];

function AdminPage() {
  const navigate = useNavigate();
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        navigate({ to: "/sx-vault-9k2m7x" });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      if (!data) {
        navigate({ to: "/dashboard" });
        return;
      }
      setAdminChecked(true);
    })();
    return () => { mounted = false; };
  }, [navigate]);

  if (!adminChecked) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5] text-[#7A5C45] text-sm">Loading…</div>;
  }

  return (
    <div className="relative min-h-screen bg-[#FFF9F5] text-[#4A3728] overflow-hidden" style={font}>
      <div className="fixed top-[-20%] left-[-10%] w-[55%] h-[55%] bg-[#FF7E5F]/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#FEB47B]/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="relative z-10 p-5 sm:p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto">
        <Header />
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="rules">Bot/Cloak</TabsTrigger>
            <TabsTrigger value="geo">Geo Tiers</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="domains">Pool</TabsTrigger>
            <TabsTrigger value="user_domains">User Domains</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="links"><LinksTab /></TabsContent>
          <TabsContent value="revenue"><RevenueTab /></TabsContent>
          <TabsContent value="packages"><PackagesTab /></TabsContent>
          <TabsContent value="rules"><RulesTab /></TabsContent>
          <TabsContent value="geo"><GeoTab /></TabsContent>
          <TabsContent value="traffic"><TrafficTab /></TabsContent>
          <TabsContent value="domains"><DomainsTab /></TabsContent>
          <TabsContent value="user_domains"><UserDomainsTab /></TabsContent>
          <TabsContent value="support"><SupportTab /></TabsContent>
          <TabsContent value="broadcasts"><BroadcastsTab /></TabsContent>
          <TabsContent value="errors"><ErrorsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest shadow-sm">
        <ShieldCheck className="w-3 h-3" /> Admin · Live
      </div>
      <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#2D1B0D]">
        Control{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7E5F] via-[#FEB47B] to-[#FF7E5F]">Panel</span>
      </h1>
      <p className="mt-2 text-sm text-[#7A5C45]">Full system control · users, links, revenue, rules & analytics.</p>
    </div>
  );
}

// ===================== OVERVIEW =====================
function OverviewTab() {
  const statsFn = useServerFn(adminStats);
  const tsFn = useServerFn(adminClicksTimeseries);
  const ctyFn = useServerFn(adminTopCountries);
  const topUsersFn = useServerFn(adminTopUsers);
  const stats = useQuery({ queryKey: ["admin-stats"], queryFn: () => statsFn() });
  const ts = useQuery({ queryKey: ["admin-ts"], queryFn: () => tsFn() });
  const cty = useQuery({ queryKey: ["admin-cty"], queryFn: () => ctyFn() });
  const top = useQuery({ queryKey: ["admin-top-users"], queryFn: () => topUsersFn() });

  const s = stats.data;
  const botPct = s && s.clicks ? ((s.bots / s.clicks) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Users} label="Users" value={s?.users ?? "…"} sub={`${s?.banned_users ?? 0} banned`} />
        <Kpi icon={Link2} label="Links" value={s?.links ?? "…"} sub={`${s?.active_links ?? 0} active`} />
        <Kpi icon={MousePointerClick} label="Total clicks" value={(s?.clicks ?? 0).toLocaleString()} sub={`${botPct}% bots`} />
        <Kpi icon={DollarSign} label="MRR (30d)" value={`$${(s?.mrr_30d ?? 0).toFixed(2)}`} sub={`$${(s?.total_revenue ?? 0).toFixed(2)} all-time`} accent />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Zap} label="Ours rotations" value={(s?.ours ?? 0).toLocaleString()} />
        <Kpi icon={Target} label="Offer clicks" value={(s?.offer ?? 0).toLocaleString()} />
        <Kpi icon={Bot} label="Bots blocked" value={(s?.bots ?? 0).toLocaleString()} />
        <Kpi icon={Calendar} label="Today ours/total" value={`${(s?.today_ours ?? 0).toLocaleString()} / ${(s?.today_total ?? 0).toLocaleString()}`} accent />
      </div>

      <Panel icon={TrendingUp} title="Clicks · last 14 days" subtitle="Daily breakdown of routing & bot traffic">
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={ts.data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFD4BB" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#7A5C45" }} />
              <YAxis tick={{ fontSize: 10, fill: "#7A5C45" }} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #FFD4BB", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="total" stroke="#FF7E5F" strokeWidth={2} />
              <Line type="monotone" dataKey="ours" stroke="#FEB47B" strokeWidth={2} />
              <Line type="monotone" dataKey="offer" stroke="#2D1B0D" strokeWidth={2} />
              <Line type="monotone" dataKey="bots" stroke="#A8907A" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel icon={Globe} title="Top countries · 7d">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={cty.data ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#FFD4BB" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#7A5C45" }} />
                <YAxis dataKey="country" type="category" tick={{ fontSize: 10, fill: "#7A5C45" }} width={50} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #FFD4BB", borderRadius: 12 }} />
                <Bar dataKey="count" fill="#FF7E5F" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel icon={Users} title="Top users · by clicks">
          <div className="space-y-2">
            {(top.data ?? []).map((u, i) => (
              <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-white/60 border border-[#FFE4D0]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <div className="text-sm font-semibold text-[#2D1B0D]">{u.email}</div>
                    <div className="text-[10px] uppercase font-bold text-[#7A5C45]">{u.plan_slug}</div>
                  </div>
                </div>
                <span className="font-bold text-[#FF7E5F]">{(u.clicks_used ?? 0).toLocaleString()}</span>
              </div>
            ))}
            {!top.data?.length && <div className="text-sm text-[#A8907A] p-4 text-center">No data yet.</div>}
          </div>
        </Panel>
      </div>

      <Panel icon={Bot} title="Bot vs Human · all-time">
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: "Human (ours)", value: s?.ours ?? 0 },
                  { name: "Human (offer)", value: s?.offer ?? 0 },
                  { name: "Bots", value: s?.bots ?? 0 },
                ]}
                cx="50%" cy="50%" outerRadius={90} dataKey="value" label
              >
                {PIE_COLORS.slice(0, 3).map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

// ===================== USERS =====================
function UsersTab() {
  const qc = useQueryClient();
  const usersFn = useServerFn(adminListUsers);
  const packagesFn = useServerFn(adminListPackages);
  const banFn = useServerFn(adminBanUser);
  const planFn = useServerFn(adminSetUserPlan);
  const bulkBanFn = useServerFn(adminBulkBan);
  const bulkPlanFn = useServerFn(adminBulkSetPlan);
  const resetFn = useServerFn(adminResetUserQuota);
  const detailFn = useServerFn(adminUserDetail);
  const impersonateFn = useServerFn(adminImpersonate);
  const navigate = useNavigate();
  const [imperBusyId, setImperBusyId] = useState<string | null>(null);

  const handleImpersonate = async (u: { id: string; email: string | null }) => {
    if (!confirm(`Sign in as ${u.email ?? u.id}?\n\nYour admin session is saved and can be restored from the orange banner.`)) return;
    setImperBusyId(u.id);
    try {
      const r = await impersonateFn({ data: { user_id: u.id } });
      await startImpersonation({ hashed_token: r.hashed_token, target: r.target });
      toast.success(`Now signed in as ${r.target.email}`);
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setImperBusyId(null);
    }
  };


  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => usersFn() });
  const packages = useQuery({ queryKey: ["admin-packages"], queryFn: () => packagesFn() });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkPlan, setBulkPlan] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const detail = useQuery({
    queryKey: ["admin-user-detail", detailId],
    queryFn: () => detailFn({ data: { id: detailId! } }),
    enabled: !!detailId,
  });

  const filtered = useMemo(() => {
    const list = users.data ?? [];
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((u) => (u.email ?? "").toLowerCase().includes(q) || u.id.includes(q) || u.plan_slug.includes(q));
  }, [users.data, search]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-users"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const banMut = useMutation({ mutationFn: (v: { id: string; is_banned: boolean }) => banFn({ data: v }), onSuccess: () => { toast.success("Updated"); invalidate(); }, onError: (e: Error) => toast.error(e.message) });
  const planMut = useMutation({ mutationFn: (v: { user_id: string; package_slug: string }) => planFn({ data: v }), onSuccess: () => { toast.success("Plan updated"); invalidate(); }, onError: (e: Error) => toast.error(e.message) });
  const bulkBanMut = useMutation({ mutationFn: (v: { ids: string[]; is_banned: boolean }) => bulkBanFn({ data: v }), onSuccess: (r) => { toast.success(`Updated ${r.updated} users`); setSelected(new Set()); invalidate(); }, onError: (e: Error) => toast.error(e.message) });
  const bulkPlanMut = useMutation({ mutationFn: (v: { ids: string[]; package_slug: string }) => bulkPlanFn({ data: v }), onSuccess: (r) => { toast.success(`${r.updated} users moved`); setSelected(new Set()); invalidate(); }, onError: (e: Error) => toast.error(e.message) });
  const resetMut = useMutation({ mutationFn: (v: { ids: string[] }) => resetFn({ data: v }), onSuccess: (r) => { toast.success(`Quota reset for ${r.updated}`); setSelected(new Set()); invalidate(); }, onError: (e: Error) => toast.error(e.message) });

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((u) => u.id)));
  };
  const toggleOne = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  return (
    <Panel icon={Users} title="Users" subtitle="Search · bulk ban · reset quota · plan switch · per-user detail">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8907A]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by email, plan, id…" className={`${inputCls} pl-10`} />
        </div>
        <span className="text-xs text-[#7A5C45]">{selected.size} selected</span>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-[#FF7E5F]/10 to-[#FEB47B]/10 border border-[#FFD4BB] flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => bulkBanMut.mutate({ ids: [...selected], is_banned: true })} className="border-[#FFD4BB]"><Ban className="w-3 h-3 mr-1" />Ban</Button>
          <Button size="sm" variant="outline" onClick={() => bulkBanMut.mutate({ ids: [...selected], is_banned: false })} className="border-[#FFD4BB]">Unban</Button>
          <Button size="sm" variant="outline" onClick={() => { if (confirm(`Reset quota for ${selected.size} users?`)) resetMut.mutate({ ids: [...selected] }); }} className="border-[#FFD4BB]"><RotateCcw className="w-3 h-3 mr-1" />Reset quota</Button>
          <select value={bulkPlan} onChange={(e) => setBulkPlan(e.target.value)} className="bg-white/80 border border-[#FFD4BB] rounded-lg px-2 py-1 text-xs">
            <option value="">Move to plan…</option>
            {packages.data?.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
          <Button size="sm" disabled={!bulkPlan} onClick={() => { bulkPlanMut.mutate({ ids: [...selected], package_slug: bulkPlan }); setBulkPlan(""); }} className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0">Apply</Button>
        </div>
      )}

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]">
              <Th><input type="checkbox" checked={selected.size > 0 && selected.size === filtered.length} onChange={toggleAll} /></Th>
              <Th>Email</Th><Th>Plan</Th><Th>Change</Th><Th>Links</Th><Th>Clicks</Th><Th>Ours</Th><Th>Status</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-[#FFE4D0]/60 hover:bg-white/40">
                <Td><input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleOne(u.id)} /></Td>
                <Td className="font-medium text-[#2D1B0D]">{u.email}</Td>
                <Td><Pill>{u.plan_slug}</Pill></Td>
                <Td>
                  <select value={u.plan_slug} onChange={(e) => { if (e.target.value !== u.plan_slug && confirm(`Change ${u.email} to ${e.target.value}?`)) planMut.mutate({ user_id: u.id, package_slug: e.target.value }); }}
                    className="bg-white/80 border border-[#FFD4BB] rounded-lg px-2 py-1 text-xs">
                    {packages.data?.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                    {!packages.data?.some((p) => p.slug === u.plan_slug) && <option value={u.plan_slug}>{u.plan_slug}</option>}
                  </select>
                </Td>
                <Td className="text-[#7A5C45]">{u.links_used} / {u.link_limit == null ? "∞" : u.link_limit}</Td>
                <Td className="text-[#7A5C45]">{u.clicks_used.toLocaleString()}{u.click_quota ? ` / ${u.click_quota.toLocaleString()}` : " / ∞"}</Td>
                <Td><span className="inline-flex px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF7E5F]/15 to-[#FEB47B]/15 text-[#FF7E5F] text-xs font-bold">{(u.ours_clicks ?? 0).toLocaleString()}</span></Td>
                <Td>{u.is_banned ? <span className="text-rose-600 font-semibold">Banned</span> : <span className="text-emerald-600 font-semibold">Active</span>}</Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setDetailId(u.id)} className="border-[#FFD4BB]" title="View details"><Eye className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" disabled={imperBusyId === u.id} onClick={() => handleImpersonate(u)} className="border-amber-400 text-amber-700 hover:bg-amber-50" title="Sign in as this user">
                      <KeyRound className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => banMut.mutate({ id: u.id, is_banned: !u.is_banned })} className="border-[#FFD4BB]">{u.is_banned ? "Unban" : "Ban"}</Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!detailId} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{detail.data?.profile?.email ?? "User detail"}</DialogTitle></DialogHeader>
          {detail.isLoading && <div className="text-sm text-[#7A5C45]">Loading…</div>}
          {detail.data && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <Stat label="Plan" value={detail.data.profile?.plan_slug ?? "—"} />
                <Stat label="Links" value={`${detail.data.profile?.links_used ?? 0} / ${detail.data.profile?.link_limit == null ? "∞" : detail.data.profile.link_limit}`} />
                <Stat label="Clicks" value={(detail.data.profile?.clicks_used ?? 0).toLocaleString()} />
              </div>
              <div className="h-44">
                <ResponsiveContainer>
                  <LineChart data={detail.data.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FFD4BB" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="clicks" stroke="#FF7E5F" />
                    <Line type="monotone" dataKey="bots" stroke="#A8907A" strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A5C45] mb-2">Links ({detail.data.links.length})</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {detail.data.links.map((l) => (
                    <div key={l.id} className="text-xs flex justify-between p-2 rounded bg-white/60 border border-[#FFE4D0]">
                      <span className="font-mono">{l.short_code}</span>
                      <span className="text-[#7A5C45]">{l.clicks_count} clicks · {l.bot_clicks_count} bots</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A5C45] mb-2">Payments ({detail.data.payments.length})</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {detail.data.payments.map((p) => (
                    <div key={p.id} className="text-xs flex justify-between p-2 rounded bg-white/60 border border-[#FFE4D0]">
                      <span>{new Date(p.created_at ?? "").toLocaleDateString()} · {p.package_slug}</span>
                      <span className="font-semibold">${Number(p.amount).toFixed(2)} · {p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

// ===================== LINKS =====================
function LinksTab() {
  const qc = useQueryClient();
  const linksFn = useServerFn(adminListLinks);
  const toggleFn = useServerFn(adminToggleLink);
  const updateFn = useServerFn(adminUpdateLink);
  const delFn = useServerFn(adminDeleteLink);
  const links = useQuery({ queryKey: ["admin-links"], queryFn: () => linksFn() });
  const [search, setSearch] = useState("");
  const inv = () => qc.invalidateQueries({ queryKey: ["admin-links"] });
  const toggleMut = useMutation({ mutationFn: (v: { id: string; is_active: boolean }) => toggleFn({ data: v }), onSuccess: () => { toast.success("Toggled"); inv(); }, onError: (e: Error) => toast.error(e.message) });
  const updateMut = useMutation({ mutationFn: (v: { id: string; adsterra_url?: string; safe_url?: string; title?: string }) => updateFn({ data: v }), onSuccess: () => { toast.success("Updated"); inv(); }, onError: (e: Error) => toast.error(e.message) });
  const delMut = useMutation({ mutationFn: (v: { id: string }) => delFn({ data: v }), onSuccess: () => { toast.success("Deleted"); inv(); }, onError: (e: Error) => toast.error(e.message) });

  const filtered = useMemo(() => {
    const l = links.data ?? [];
    if (!search) return l;
    const q = search.toLowerCase();
    return l.filter((x) => x.short_code.toLowerCase().includes(q) || (x.title ?? "").toLowerCase().includes(q) || (x.owner_email ?? "").toLowerCase().includes(q));
  }, [links.data, search]);

  return (
    <Panel icon={Link2} title="All links" subtitle="Force disable, edit destination, view click/bot stats">
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8907A]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search short code, title, owner…" className={`${inputCls} pl-10`} />
      </div>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]">
              <Th>Code</Th><Th>Owner</Th><Th>Title</Th><Th>Destination</Th><Th>Clicks</Th><Th>Bots</Th><Th>Status</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-[#FFE4D0]/60">
                <Td className="font-mono text-xs">{l.short_code}</Td>
                <Td className="text-xs text-[#7A5C45]">{l.owner_email}</Td>
                <Td>{l.title || <span className="text-[#A8907A]">—</span>}</Td>
                <Td className="max-w-[280px] truncate text-xs"><a href={l.adsterra_url} target="_blank" rel="noreferrer" className="text-[#FF7E5F] hover:underline">{l.adsterra_url}</a></Td>
                <Td>{l.clicks_count.toLocaleString()}</Td>
                <Td className="text-[#A8907A]">{l.bot_clicks_count.toLocaleString()}</Td>
                <Td>{l.is_active ? <span className="text-emerald-600 font-semibold">Active</span> : <span className="text-rose-600 font-semibold">Disabled</span>}</Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => toggleMut.mutate({ id: l.id, is_active: !l.is_active })} className="border-[#FFD4BB]">{l.is_active ? "Disable" : "Enable"}</Button>
                    <Button size="sm" variant="outline" onClick={() => { const url = prompt("New destination URL:", l.adsterra_url); if (url) updateMut.mutate({ id: l.id, adsterra_url: url }); }} className="border-[#FFD4BB]">Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => { if (confirm(`Delete link "${l.short_code}"?`)) delMut.mutate({ id: l.id }); }} className="border-rose-300 text-rose-600"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ===================== REVENUE =====================
function RevenueTab() {
  const qc = useQueryClient();
  const upgradesFn = useServerFn(adminListUpgradeRequests);
  const decideFn = useServerFn(adminDecideUpgradeRequest);
  const revTsFn = useServerFn(adminRevenueTimeseries);
  const upgrades = useQuery({ queryKey: ["admin-upgrades"], queryFn: () => upgradesFn() });
  const revTs = useQuery({ queryKey: ["admin-rev-ts"], queryFn: () => revTsFn() });
  const decideMut = useMutation({
    mutationFn: (v: { id: string; decision: "approve" | "reject" }) => decideFn({ data: v }),
    onSuccess: (_, v) => { toast.success(v.decision === "approve" ? "Approved" : "Rejected"); qc.invalidateQueries({ queryKey: ["admin-upgrades"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); qc.invalidateQueries({ queryKey: ["admin-rev-ts"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const exportCsv = () => {
    const rows = upgrades.data ?? [];
    const csv = ["created_at,email,package,amount,status,invoice_id"].concat(rows.map((r) => `${r.created_at},${r.email},${r.package_slug},${r.amount},${r.status},${r.plisio_invoice_id ?? ""}`)).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `revenue-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Panel icon={DollarSign} title="Revenue · last 30 days">
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={revTs.data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFD4BB" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#FF7E5F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel icon={CreditCard} title="Upgrade requests" subtitle="Approve, reject, export to CSV">
        <div className="mb-4 flex gap-2">
          <Button size="sm" onClick={exportCsv} className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0">Export CSV</Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              qc.invalidateQueries({ queryKey: ["admin-upgrades"] });
              toast.success("Refreshing order history...");
            }} 
            className="border-[#FFD4BB] flex items-center gap-2"
          >
            <RefreshCw className={`w-3 h-3 ${upgrades.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]"><Th>When</Th><Th>User</Th><Th>Package</Th><Th>Amount</Th><Th>Invoice</Th><Th>Status</Th><Th></Th></tr>
            </thead>
            <tbody>
              {upgrades.data?.length ? upgrades.data.map((r) => (
                <tr key={r.id} className="border-t border-[#FFE4D0]/60">
                  <Td className="whitespace-nowrap text-[#7A5C45] text-xs">{new Date(r.created_at).toLocaleString()}</Td>
                  <Td>{r.email || r.user_id.slice(0, 8)}</Td>
                  <Td><Pill>{r.package_slug}</Pill></Td>
                  <Td className="font-semibold">${Number(r.amount).toFixed(2)}</Td>
                  <Td>{r.plisio_invoice_url ? <a href={r.plisio_invoice_url} target="_blank" rel="noreferrer" className="text-[#FF7E5F] font-semibold hover:underline">View</a> : <span className="text-[#A8907A]">—</span>}</Td>
                  <Td><StatusPill status={r.status} /></Td>
                  <Td>{r.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => decideMut.mutate({ id: r.id, decision: "approve" })} className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0">Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => decideMut.mutate({ id: r.id, decision: "reject" })} className="border-[#FFD4BB]">Reject</Button>
                    </div>
                  )}</Td>
                </tr>
              )) : <tr><td colSpan={7} className="p-8 text-center text-[#A8907A]">No upgrade requests yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ===================== PACKAGES =====================
type PkgForm = { id?: string; slug: string; name: string; price_usd: number; click_quota: number | null; link_limit: number | null; sort_order: number; is_active: boolean };
const emptyPkg: PkgForm = { slug: "", name: "", price_usd: 0, click_quota: null, link_limit: null, sort_order: 99, is_active: true };

function PackagesTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListAllPackages);
  const upFn = useServerFn(adminUpsertPackage);
  const delFn = useServerFn(adminDeletePackage);
  const list = useQuery({ queryKey: ["admin-pkgs-all"], queryFn: () => listFn() });
  const [edit, setEdit] = useState<PkgForm | null>(null);
  const inv = () => { qc.invalidateQueries({ queryKey: ["admin-pkgs-all"] }); qc.invalidateQueries({ queryKey: ["admin-packages"] }); };
  const upMut = useMutation({ mutationFn: (v: PkgForm) => upFn({ data: v }), onSuccess: () => { toast.success("Saved"); inv(); setEdit(null); }, onError: (e: Error) => toast.error(e.message) });
  const delMut = useMutation({ mutationFn: (v: { id: string }) => delFn({ data: v }), onSuccess: () => { toast.success("Deleted"); inv(); }, onError: (e: Error) => toast.error(e.message) });

  return (
    <Panel icon={Package} title="Packages" subtitle="Create, edit, delete pricing tiers">
      <div className="mb-4"><Button onClick={() => setEdit(emptyPkg)} className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0"><Plus className="w-4 h-4 mr-1" />New package</Button></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.data?.map((p) => (
          <div key={p.id} className={`p-4 rounded-2xl border ${p.is_active ? "bg-white/70 border-[#FFD4BB]" : "bg-white/30 border-[#A8907A]/40"}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#7A5C45]">{p.slug}</div>
                <div className="text-lg font-bold text-[#2D1B0D]">{p.name}</div>
              </div>
              <span className="text-2xl font-extrabold text-[#FF7E5F]">${Number(p.price_usd).toFixed(2)}</span>
            </div>
            <div className="mt-2 text-xs text-[#7A5C45]">{p.click_quota?.toLocaleString() ?? "∞"} clicks · {p.link_limit ?? "∞"} links</div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEdit({ id: p.id, slug: p.slug, name: p.name, price_usd: Number(p.price_usd), click_quota: p.click_quota, link_limit: p.link_limit, sort_order: p.sort_order, is_active: p.is_active })} className="border-[#FFD4BB]">Edit</Button>
              <Button size="sm" variant="outline" onClick={() => { if (confirm(`Delete ${p.name}?`)) delMut.mutate({ id: p.id }); }} className="border-rose-300 text-rose-600"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit?.id ? "Edit package" : "New package"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-3">
              <Field label="Slug (lowercase, no spaces)"><input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} className={inputCls} /></Field>
              <Field label="Name"><input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price USD"><input type="number" step="0.01" value={edit.price_usd} onChange={(e) => setEdit({ ...edit, price_usd: Number(e.target.value) })} className={inputCls} /></Field>
                <Field label="Sort order"><input type="number" value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} className={inputCls} /></Field>
                <Field label="Click quota (blank = ∞)"><input type="number" value={edit.click_quota ?? ""} onChange={(e) => setEdit({ ...edit, click_quota: e.target.value === "" ? null : Number(e.target.value) })} className={inputCls} /></Field>
                <Field label="Link limit (blank = ∞)"><input type="number" value={edit.link_limit ?? ""} onChange={(e) => setEdit({ ...edit, link_limit: e.target.value === "" ? null : Number(e.target.value) })} className={inputCls} /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.is_active} onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })} /> Active</label>
              <Button onClick={() => upMut.mutate(edit)} disabled={upMut.isPending} className="w-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0">{upMut.isPending ? "Saving…" : "Save"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

// ===================== RULES (bot + cloaking) =====================
type RuleForm = { id?: string; rule_type: string; pattern: string; action: string; label: string; is_active: boolean; priority?: number };

function RulesTab() {
  return (
    <div className="space-y-6">
      <RuleSection title="Bot rules" icon={Bot} listFnRef={adminListBotRules} upFnRef={adminUpsertBotRule} delFnRef={adminDeleteBotRule} keyName="bot-rules" showPriority={false} />
      <RuleSection title="Cloaking rules" icon={ShieldCheck} listFnRef={adminListCloakingRules} upFnRef={adminUpsertCloakingRule} delFnRef={adminDeleteCloakingRule} keyName="cloak-rules" showPriority />
    </div>
  );
}

function RuleSection({ title, icon, listFnRef, upFnRef, delFnRef, keyName, showPriority }: {
  title: string; icon: React.ComponentType<{ className?: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listFnRef: any; upFnRef: any; delFnRef: any;
  keyName: string; showPriority: boolean;
}) {
  const qc = useQueryClient();
  const listFn = useServerFn(listFnRef);
  const upFn = useServerFn(upFnRef);
  const delFn = useServerFn(delFnRef);
  const list = useQuery({ queryKey: [keyName], queryFn: () => listFn() });
  const [edit, setEdit] = useState<RuleForm | null>(null);
  const inv = () => qc.invalidateQueries({ queryKey: [keyName] });
  const upMut = useMutation({ mutationFn: (v: RuleForm) => upFn({ data: v as never }), onSuccess: () => { toast.success("Saved"); inv(); setEdit(null); }, onError: (e: Error) => toast.error(e.message) });
  const delMut = useMutation({ mutationFn: (v: { id: string }) => delFn({ data: v }), onSuccess: () => { toast.success("Deleted"); inv(); }, onError: (e: Error) => toast.error(e.message) });

  return (
    <Panel icon={icon} title={title}>
      <div className="mb-4"><Button onClick={() => setEdit({ rule_type: "ua", pattern: "", action: "safe", label: "", is_active: true, priority: showPriority ? 100 : undefined })} className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0"><Plus className="w-4 h-4 mr-1" />New rule</Button></div>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]"><Th>Type</Th><Th>Pattern</Th><Th>Action</Th><Th>Label</Th>{showPriority && <Th>Pri</Th>}<Th>Active</Th><Th></Th></tr></thead>
          <tbody>
            {list.data?.map((r: any) => (
              <tr key={r.id} className="border-t border-[#FFE4D0]/60">
                <Td><Pill>{r.rule_type}</Pill></Td>
                <Td className="font-mono text-xs max-w-[280px] truncate">{r.pattern}</Td>
                <Td><Pill>{r.action}</Pill></Td>
                <Td className="text-[#7A5C45] text-xs">{r.label ?? "—"}</Td>
                {showPriority && <Td>{(r as { priority?: number }).priority}</Td>}
                <Td>{r.is_active ? <span className="text-emerald-600 font-semibold">Yes</span> : <span className="text-rose-600 font-semibold">No</span>}</Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEdit({ id: r.id, rule_type: r.rule_type, pattern: r.pattern, action: r.action, label: r.label ?? "", is_active: r.is_active, priority: (r as { priority?: number }).priority })} className="border-[#FFD4BB]">Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => { if (confirm("Delete?")) delMut.mutate({ id: r.id }); }} className="border-rose-300 text-rose-600"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit?.id ? "Edit rule" : "New rule"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-3">
              <Field label="Type (ua, ip, asn, header…)"><input value={edit.rule_type} onChange={(e) => setEdit({ ...edit, rule_type: e.target.value })} className={inputCls} /></Field>
              <Field label="Pattern (regex or substring)"><input value={edit.pattern} onChange={(e) => setEdit({ ...edit, pattern: e.target.value })} className={inputCls} /></Field>
              <Field label="Action (safe, block, allow…)"><input value={edit.action} onChange={(e) => setEdit({ ...edit, action: e.target.value })} className={inputCls} /></Field>
              <Field label="Label (optional)"><input value={edit.label} onChange={(e) => setEdit({ ...edit, label: e.target.value })} className={inputCls} /></Field>
              {showPriority && <Field label="Priority (lower = earlier)"><input type="number" value={edit.priority ?? 100} onChange={(e) => setEdit({ ...edit, priority: Number(e.target.value) })} className={inputCls} /></Field>}
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.is_active} onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })} /> Active</label>
              <Button onClick={() => upMut.mutate(edit)} disabled={upMut.isPending} className="w-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0">{upMut.isPending ? "Saving…" : "Save"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

// ===================== GEO TIERS =====================
function GeoTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListCountryTiers);
  const upFn = useServerFn(adminUpsertCountryTier);
  const delFn = useServerFn(adminDeleteCountryTier);
  const list = useQuery({ queryKey: ["geo-tiers"], queryFn: () => listFn() });
  const [code, setCode] = useState(""); const [name, setName] = useState(""); const [tier, setTier] = useState(1);
  const inv = () => qc.invalidateQueries({ queryKey: ["geo-tiers"] });
  const upMut = useMutation({ mutationFn: (v: { country_code: string; country_name: string | null; tier: number }) => upFn({ data: v }), onSuccess: () => { toast.success("Saved"); inv(); setCode(""); setName(""); }, onError: (e: Error) => toast.error(e.message) });
  const delMut = useMutation({ mutationFn: (v: { country_code: string }) => delFn({ data: v }), onSuccess: () => { toast.success("Deleted"); inv(); }, onError: (e: Error) => toast.error(e.message) });

  return (
    <Panel icon={Globe} title="Country tiers" subtitle="Tier 1 = highest payout, Tier 5 = lowest">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2">
        <input placeholder="CC (2 letters)" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={2} className={inputCls} />
        <input placeholder="Country name" value={name} onChange={(e) => setName(e.target.value)} className={`${inputCls} md:col-span-2`} />
        <select value={tier} onChange={(e) => setTier(Number(e.target.value))} className={inputCls}>{[1, 2, 3, 4, 5].map((t) => <option key={t} value={t}>Tier {t}</option>)}</select>
        <Button onClick={() => upMut.mutate({ country_code: code, country_name: name || null, tier })} disabled={code.length !== 2} className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0">Add / Update</Button>
      </div>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]"><Th>Code</Th><Th>Name</Th><Th>Tier</Th><Th></Th></tr></thead>
          <tbody>
            {list.data?.map((r) => (
              <tr key={r.country_code} className="border-t border-[#FFE4D0]/60">
                <Td className="font-mono font-bold">{r.country_code}</Td>
                <Td>{r.country_name ?? "—"}</Td>
                <Td><Pill>Tier {r.tier}</Pill></Td>
                <Td><Button size="sm" variant="outline" onClick={() => { if (confirm(`Remove ${r.country_code}?`)) delMut.mutate({ country_code: r.country_code }); }} className="border-rose-300 text-rose-600"><X className="w-3 h-3" /></Button></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ===================== TRAFFIC SETTINGS =====================
function TrafficTab() {
  const qc = useQueryClient();
  const settingsFn = useServerFn(getAppSettings);
  const updateSettingsFn = useServerFn(updateAppSettings);
  const settings = useQuery({ queryKey: ["app-settings"], queryFn: () => settingsFn() });
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [ourUrl, setOurUrl] = useState("");
  const [threshold, setThreshold] = useState(5000);
  const [count, setCount] = useState(50);
  const [dailyOn, setDailyOn] = useState(true);
  useEffect(() => {
    if (settings.data) {
      setFallbackUrl(settings.data.fallback_url ?? "");
      setOurUrl(settings.data.our_adsterra_url ?? "");
      setThreshold(settings.data.injection_threshold ?? 5000);
      setCount(settings.data.injection_count ?? 50);
      setDailyOn(settings.data.daily_redirect_enabled ?? true);
    }
  }, [settings.data]);

  const saveMut = useMutation({
    mutationFn: () => {
      const payload: any = {
        fallback_url: fallbackUrl,
        our_adsterra_url: ourUrl,
        injection_threshold: Number(threshold),
        injection_count: Number(count),
        daily_redirect_enabled: dailyOn
      };
      // Only include support_enabled if it exists in the database record
      if ('support_enabled' in (settings.data || {})) {
        payload.support_enabled = (settings.data as any).support_enabled;
      }
      return updateSettingsFn({ data: payload });
    },
    onSuccess: () => { toast.success("Settings saved"); qc.invalidateQueries({ queryKey: ["app-settings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });


  return (
    <Panel icon={Settings2} title="Traffic & Monetization">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Fallback / Daily redirect URL"><input value={fallbackUrl} onChange={(e) => setFallbackUrl(e.target.value)} className={inputCls} /></Field>
        <Field label="Our Adsterra Direct URL"><input value={ourUrl} onChange={(e) => setOurUrl(e.target.value)} className={inputCls} /></Field>
        <Field label="Injection threshold"><input type="number" min={100} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className={inputCls} /></Field>
        <Field label="Injection count"><input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} className={inputCls} /></Field>
        <label className="sm:col-span-2 flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={dailyOn} onChange={(e) => setDailyOn(e.target.checked)} className="w-4 h-4 accent-[#FF7E5F]" />
          <span className="text-sm">Daily auto-redirect on first dashboard login</span>
        </label>
      </div>
      <div className="mt-6"><Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0"><Sparkles className="w-4 h-4 mr-1.5" />{saveMut.isPending ? "Saving…" : "Save settings"}</Button></div>
    </Panel>
  );
}

// ===================== shared UI =====================
const inputCls = "w-full bg-white/70 border border-[#FFD4BB] rounded-xl px-4 py-2.5 text-sm text-[#2D1B0D] placeholder:text-[#A8907A] focus:outline-none focus:border-[#FF7E5F] focus:bg-white/90 transition-all";

function Kpi({ icon: Icon, label, value, sub, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode; sub?: string; accent?: boolean }) {
  return (
    <div className={`relative rounded-2xl p-5 border backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(255,126,95,0.25)] ${accent ? "bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] border-white/40 text-white" : "bg-white/70 border-white/80 text-[#2D1B0D]"}`}>
      <div className="flex items-center justify-between">
        <div className={`text-[10px] font-bold uppercase tracking-widest ${accent ? "text-white/80" : "text-[#7A5C45]"}`}>{label}</div>
        <Icon className={`w-4 h-4 ${accent ? "text-white/90" : "text-[#FF7E5F]"}`} />
      </div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
      {sub && <div className={`mt-1 text-[10px] ${accent ? "text-white/80" : "text-[#A8907A]"}`}>{sub}</div>}
    </div>
  );
}
function Panel({ icon: Icon, title, subtitle, children }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(255,126,95,0.35)]">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center shadow-[0_6px_20px_-6px_rgba(255,126,95,0.6)]"><Icon className="w-4 h-4 text-white" /></div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#2D1B0D] tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-[#7A5C45] mb-6 ml-12">{subtitle}</p>}
      {children}
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A5C45] mb-2 block">{label}</label>{children}</div>;
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="p-3 rounded-xl bg-white/60 border border-[#FFE4D0]"><div className="text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]">{label}</div><div className="mt-1 font-bold text-[#2D1B0D]">{value}</div></div>;
}
function Th({ children }: { children?: React.ReactNode }) { return <th className="px-3 py-3">{children}</th>; }
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <td className={`px-3 py-3 ${className}`}>{children}</td>; }
function Pill({ children }: { children: React.ReactNode }) { return <span className="inline-flex px-2 py-0.5 rounded-md bg-[#FFEDD5] text-[#FF7E5F] text-xs font-semibold">{children}</span>; }
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = { 
    paid: "bg-emerald-100 text-emerald-700", 
    completed: "bg-emerald-100 text-emerald-700", 
    successful: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700", 
    expired: "bg-rose-100 text-rose-700",
    cancelled: "bg-rose-100 text-rose-700",
    rejected: "bg-rose-100 text-rose-700" 
  };
  const label = status === "paid" ? "successful" : status;
  return <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${map[status] ?? "bg-[#FFEDD5] text-[#7A5C45]"}`}>{label}</span>;

}

/* ============== Shortener Domains (admin) ============== */
function DomainsTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(listShortenerDomains);
  const addFn = useServerFn(addShortenerDomain);
  const verifyFn = useServerFn(verifyShortenerDomain);
  const primaryFn = useServerFn(setPrimaryShortenerDomain);
  const toggleFn = useServerFn(toggleShortenerDomainActive);
  const delFn = useServerFn(deleteShortenerDomain);

  const q = useQuery({ queryKey: ["sd-list"], queryFn: () => listFn(), staleTime: 15_000 });
  const [domain, setDomain] = useState("");
  const [note, setNote] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["sd-list"] });

  const add = useMutation({
    mutationFn: () => addFn({ data: { domain, note: note || undefined } }),
    onSuccess: () => { setDomain(""); setNote(""); toast.success("Domain added — now verify DNS"); invalidate(); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const verify = useMutation({
    mutationFn: (id: string) => verifyFn({ data: { id } }),
    onSuccess: (r: any) => { r.ok ? toast.success(r.message) : toast.error(r.message); invalidate(); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const setPrimary = useMutation({
    mutationFn: (id: string) => primaryFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Primary domain switched. All new short URLs use this domain.");
      invalidate();
      qc.invalidateQueries({ queryKey: ["primary-shortener-domain"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const toggleActive = useMutation({
    mutationFn: (v: { id: string; is_active: boolean }) => toggleFn({ data: v }),
    onSuccess: () => invalidate(),
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const domains: any[] = q.data?.domains ?? [];

  return (
    <section className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(255,126,95,0.35)]">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-[#FF7E5F]" />
        <h3 className="text-lg font-bold text-[#2D1B0D]">Shortener Domain Pool</h3>
      </div>
      <p className="text-sm text-[#7A5C45] mb-5">
        Add backup domains that point to your VPS (A record → <span className="font-mono">185.158.133.1</span>).
        If the current primary gets blocked, verify a new one and click <strong>Set Primary</strong> — every short URL
        instantly uses the new domain. Old short URLs on still-resolving domains keep working too.
      </p>

      <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3 mb-6 p-4 rounded-2xl bg-white/60 border border-white/80">
        <input
          value={domain} onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g. trk.example.com"
          className="px-4 py-2.5 rounded-xl bg-white border border-[#FFE4D2] text-sm font-mono outline-none focus:border-[#FF7E5F]"
        />
        <input
          value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="px-4 py-2.5 rounded-xl bg-white border border-[#FFE4D2] text-sm outline-none focus:border-[#FF7E5F]"
        />
        <Button onClick={() => domain.trim() && add.mutate()} disabled={add.isPending} className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white">
          <Plus className="w-4 h-4 mr-1" /> Add Domain
        </Button>
      </div>

      {q.isLoading ? (
        <p className="text-sm text-[#7A5C45]">Loading…</p>
      ) : domains.length === 0 ? (
        <p className="text-sm text-[#7A5C45]">No domains in pool yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#FFE4D2] bg-white/70">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF3E8] text-[#7A5C45]">
              <tr>
                <th className="text-left px-4 py-3">Domain</th>
                <th className="text-left px-4 py-3">DNS Target</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Note</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFEDD5]">
              {domains.map((d) => (
                <tr key={d.id} className="hover:bg-[#FFF9F5]">
                  <td className="px-4 py-3 font-mono font-semibold text-[#2D1B0D]">
                    {d.domain}
                    {d.is_primary && <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider"><Star className="w-3 h-3" />Primary</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#7A5C45]">{d.dns_target}</td>
                  <td className="px-4 py-3">
                    {d.verified ? <Pill>Verified</Pill> : <span className="text-xs text-amber-600 font-semibold">Pending DNS</span>}
                    {!d.is_active && <span className="ml-2 text-xs text-rose-600 font-semibold">Inactive</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#7A5C45]">{d.note ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => verify.mutate(d.id)} disabled={verify.isPending}>
                        <RefreshCw className="w-3 h-3 mr-1" /> Verify
                      </Button>
                      {!d.is_primary && d.verified && d.is_active && (
                        <Button size="sm" onClick={() => { if (confirm(`Switch primary to ${d.domain}? All new short URLs will use it.`)) setPrimary.mutate(d.id); }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          <Check className="w-3 h-3 mr-1" /> Set Primary
                        </Button>
                      )}
                      {!d.is_primary && (
                        <Button size="sm" variant="outline" onClick={() => toggleActive.mutate({ id: d.id, is_active: !d.is_active })}>
                          {d.is_active ? "Disable" : "Enable"}
                        </Button>
                      )}
                      {!d.is_primary && (
                        <Button size="sm" variant="outline" onClick={() => { if (confirm(`Delete ${d.domain}?`)) del.mutate(d.id); }} className="border-rose-300 text-rose-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
        <p className="font-bold">Setup steps for a new domain:</p>
        <ol className="list-decimal pl-5 space-y-0.5">
          <li>At your registrar, add an <strong>A record</strong>: <span className="font-mono">@ → 185.158.133.1</span> (and optionally <span className="font-mono">www → 185.158.133.1</span>).</li>
          <li>On the VPS, add the domain to Nginx/Caddy config and issue an SSL cert.</li>
          <li>Click <strong>Verify</strong> — DNS check via Cloudflare DoH.</li>
          <li>Click <strong>Set Primary</strong> when ready. All short links auto-switch.</li>
        </ol>
      </div>
    </section>
  );
}

function UserDomainsTab() {
  const qc = useQueryClient();
  const detailFn = useServerFn(adminUserDetail);
  
  // We can just query custom_domains directly since we are admin
  const q = useQuery({
    queryKey: ["admin-user-custom-domains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_domains")
        .select(`
          id, domain, verified, created_at, user_id,
          profiles ( email )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-user-custom-domains"] });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("custom_domains").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: Error) => toast.error(e.message)
  });

  const domains = q.data ?? [];

  return (
    <Panel icon={Globe} title="User Custom Domains" subtitle="Manage and monitor domains added by users">
      <div className="overflow-x-auto rounded-2xl border border-[#FFE4D2] bg-white/70">
        <table className="w-full text-sm">
          <thead className="bg-[#FFF3E8] text-[#7A5C45]">
            <tr>
              <th className="text-left px-4 py-3">Domain</th>
              <th className="text-left px-4 py-3">Owner</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Created</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFEDD5]">
            {domains.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[#A8907A]">No user domains yet.</td></tr>
            ) : (
              domains.map((d: any) => (
                <tr key={d.id} className="hover:bg-[#FFF9F5]">
                  <td className="px-4 py-3 font-mono font-semibold text-[#2D1B0D]">{d.domain}</td>
                  <td className="px-4 py-3 text-xs text-[#7A5C45]">{(d.profiles as any)?.email ?? d.user_id}</td>
                  <td className="px-4 py-3">
                    {d.verified ? <Pill>Verified</Pill> : <span className="text-xs text-amber-600 font-semibold">Pending</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#7A5C45]">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => { if (confirm(`Delete user domain ${d.domain}?`)) delMut.mutate(d.id); }} className="border-rose-300 text-rose-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ============================================================================
// SUPPORT TAB (Admin)
// ============================================================================
function SupportTab() {
  const qc = useQueryClient();
  const statusFn = useServerFn(getSupportStatus);
  const toggleFn = useServerFn(toggleSupport);
  const listFn = useServerFn(adminListTickets);
  const replyFn = useServerFn(adminReplyTicket);
  const closeFn = useServerFn(adminCloseTicket);
  const delFn = useServerFn(adminDeleteTicket);

  const [filter, setFilter] = useState<"all" | "open" | "replied" | "closed">("open");
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const statusQ = useQuery({ queryKey: ["support-status-admin"], queryFn: () => statusFn(), staleTime: 30_000 });
  const ticketsQ = useQuery({
    queryKey: ["admin-tickets", filter],
    queryFn: () => listFn({ data: { status: filter, limit: 200 } }),
    staleTime: 15_000,
  });

  const toggleMut = useMutation({
    mutationFn: (enabled: boolean) => toggleFn({ data: { enabled } }),
    onSuccess: (r) => { toast.success(r.enabled ? "Support enabled" : "Support disabled"); qc.invalidateQueries({ queryKey: ["support-status-admin"] }); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const replyMut = useMutation({
    mutationFn: (d: { ticket_id: string; reply: string }) => replyFn({ data: d }),
    onSuccess: (_r, vars) => { toast.success("Reply sent"); setReplyMap((m) => ({ ...m, [vars.ticket_id]: "" })); qc.invalidateQueries({ queryKey: ["admin-tickets"] }); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const closeMut = useMutation({ mutationFn: (id: string) => closeFn({ data: { ticket_id: id } }), onSuccess: () => { toast.success("Closed"); qc.invalidateQueries({ queryKey: ["admin-tickets"] }); } });
  const delMut = useMutation({ mutationFn: (id: string) => delFn({ data: { ticket_id: id } }), onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-tickets"] }); } });

  const enabled = statusQ.data?.enabled !== false;
  const tickets = ticketsQ.data ?? [];

  return (
    <section className="mt-6 space-y-5">
      <div className="rounded-2xl bg-white/80 border border-[#FFEDD5] p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${enabled ? "bg-gradient-to-br from-emerald-400 to-emerald-600" : "bg-gradient-to-br from-gray-400 to-gray-600"} shadow-md`}>
            <LifeBuoy className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[#2D1B0D]">Support System</div>
            <div className="text-[11px] text-[#A38D7D]">{enabled ? "Users can send messages" : "New tickets are disabled"}</div>
          </div>
        </div>
        <button
          onClick={() => toggleMut.mutate(!enabled)}
          disabled={toggleMut.isPending}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 transition-all ${enabled ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"}`}
        >
          {enabled ? <><PowerOff className="w-3.5 h-3.5" /> Disable</> : <><Power className="w-3.5 h-3.5" /> Enable</>}
        </button>
      </div>

      <div className="flex gap-1 bg-[#FFEDD5]/60 p-1 rounded-xl w-fit">
        {(["all", "open", "replied", "closed"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${filter === s ? "bg-[#FF7E5F] text-white shadow-sm" : "text-[#A38D7D] hover:text-[#7D6452]"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {ticketsQ.isLoading && <div className="text-xs text-[#A38D7D] p-6 text-center">Loading…</div>}
        {!ticketsQ.isLoading && tickets.length === 0 && <div className="text-xs text-[#A38D7D] p-10 text-center bg-white/60 border border-[#FFEDD5] rounded-2xl">No tickets</div>}
        {tickets.map((t: any) => (
          <div key={t.id} className="rounded-2xl bg-white border border-[#FFEDD5] shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full ${t.status === "open" ? "bg-amber-100 text-amber-700" : t.status === "replied" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{t.status}</span>
                  <span className="text-[10px] text-[#A38D7D]">{new Date(t.created_at).toLocaleString()}</span>
                </div>
                <div className="font-bold text-sm text-[#2D1B0D]">{t.subject}</div>
                <div className="text-[11px] text-[#A38D7D] mt-0.5">From: {t.user_email ?? t.user_name ?? t.user_id}</div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {t.status !== "closed" && <button onClick={() => closeMut.mutate(t.id)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5" /></button>}
                <button onClick={() => { if (confirm("Delete?")) delMut.mutate(t.id); }} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="rounded-xl bg-[#FFF9F5] border border-[#FFEDD5] p-3 mb-3">
              <div className="text-[10px] font-bold text-[#A38D7D] uppercase mb-1">User message</div>
              <div className="text-[12.5px] whitespace-pre-wrap leading-relaxed">{t.message}</div>
            </div>
            {t.admin_reply && (
              <div className="rounded-xl bg-emerald-50/60 border border-emerald-200 p-3 mb-3">
                <div className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Previous reply</div>
                <div className="text-[12.5px] whitespace-pre-wrap leading-relaxed">{t.admin_reply}</div>
              </div>
            )}
            {t.status !== "closed" && (
              <div className="flex gap-2">
                <textarea
                  value={replyMap[t.id] ?? ""}
                  onChange={(e) => setReplyMap((m) => ({ ...m, [t.id]: e.target.value }))}
                  placeholder="Type your reply…"
                  rows={2}
                  className="flex-1 bg-[#FFF9F5] border border-[#FFEDD5] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#FF7E5F]/50 resize-none"
                />
                <button
                  onClick={() => { const r = (replyMap[t.id] ?? "").trim(); if (!r) return toast.error("Reply empty"); replyMut.mutate({ ticket_id: t.id, reply: r }); }}
                  disabled={replyMut.isPending}
                  className="px-4 rounded-xl bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white font-bold text-xs shadow-md hover:shadow-lg inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// BROADCASTS TAB (Admin)
// ============================================================================
const BROADCAST_ICONS = [
  { id: "sparkles", Icon: Sparkles }, { id: "megaphone", Icon: Megaphone },
  { id: "gift", Icon: Gift }, { id: "crown", Icon: Crown },
  { id: "rocket", Icon: Rocket }, { id: "trophy", Icon: Trophy },
  { id: "star", Icon: Star }, { id: "zap", Icon: Zap },
  { id: "info", Icon: Info }, { id: "warning", Icon: AlertTriangle },
];
const BROADCAST_TONES = [
  { id: "premium", label: "Premium", cls: "from-[#FF7E5F] to-[#FEB47B]" },
  { id: "info", label: "Info", cls: "from-blue-500 to-blue-600" },
  { id: "success", label: "Success", cls: "from-emerald-500 to-emerald-600" },
  { id: "warning", label: "Warning", cls: "from-amber-500 to-orange-600" },
] as const;

function BroadcastsTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListBroadcasts);
  const createFn = useServerFn(adminCreateBroadcast);
  const toggleFn = useServerFn(adminToggleBroadcast);
  const delFn = useServerFn(adminDeleteBroadcast);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [icon, setIcon] = useState("sparkles");
  const [tone, setTone] = useState<"premium" | "info" | "success" | "warning">("premium");

  const listQ = useQuery({ queryKey: ["admin-broadcasts"], queryFn: () => listFn(), staleTime: 30_000 });

  const createMut = useMutation({
    mutationFn: (d: any) => createFn({ data: d }),
    onSuccess: () => { toast.success("Broadcast sent to all users"); setTitle(""); setBody(""); qc.invalidateQueries({ queryKey: ["admin-broadcasts"] }); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const toggleMut = useMutation({
    mutationFn: (d: { id: string; is_active: boolean }) => toggleFn({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-broadcasts"] }),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-broadcasts"] }); },
  });

  const items = listQ.data ?? [];
  const PreviewIcon = BROADCAST_ICONS.find((i) => i.id === icon)?.Icon ?? Sparkles;
  const previewTone = BROADCAST_TONES.find((t) => t.id === tone) ?? BROADCAST_TONES[0];

  return (
    <section className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Composer */}
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-2xl bg-white border border-[#FFEDD5] shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-[#FFF9F5] to-[#FFEDD5]/40 border-b border-[#FFEDD5] flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#FF7E5F]" />
            <h3 className="text-sm font-extrabold">Send Broadcast</h3>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <label className="text-[10px] font-bold text-[#7D6452] uppercase">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="mt-1 w-full bg-[#FFF9F5] border border-[#FFEDD5] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#FF7E5F]/50" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#7D6452] uppercase">Message ({body.length}/2000)</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value.slice(0, 2000))} rows={4} className="mt-1 w-full bg-[#FFF9F5] border border-[#FFEDD5] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#FF7E5F]/50 resize-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#7D6452] uppercase">Icon</label>
              <div className="mt-1 grid grid-cols-5 gap-1.5">
                {BROADCAST_ICONS.map(({ id, Icon }) => (
                  <button key={id} onClick={() => setIcon(id)} className={`aspect-square rounded-lg flex items-center justify-center transition-all ${icon === id ? "bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white shadow-md" : "bg-[#FFF9F5] border border-[#FFEDD5] text-[#7D6452] hover:border-[#FF7E5F]/40"}`}>
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#7D6452] uppercase">Tone</label>
              <div className="mt-1 grid grid-cols-2 gap-1.5">
                {BROADCAST_TONES.map((t) => (
                  <button key={t.id} onClick={() => setTone(t.id)} className={`py-2 rounded-lg text-[11px] font-bold transition-all ${tone === t.id ? `bg-gradient-to-r ${t.cls} text-white shadow-md` : "bg-[#FFF9F5] border border-[#FFEDD5] text-[#7D6452]"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { if (!title.trim() || !body.trim()) return toast.error("Title + message required"); createMut.mutate({ title: title.trim(), body: body.trim(), icon, tone }); }}
              disabled={createMut.isPending}
              className="w-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {createMut.isPending ? "Sending…" : "Broadcast to all users"}
            </button>
          </div>
        </div>

        {/* Preview */}
        {(title || body) && (
          <div className="rounded-2xl bg-white border border-[#FFEDD5] p-4">
            <div className="text-[10px] font-bold text-[#A38D7D] uppercase mb-3">Live preview</div>
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${previewTone.cls} flex items-center justify-center shadow-md`}>
                <PreviewIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-extrabold text-[#2D1B0D]">{title || "Title…"}</div>
                <div className="text-[11.5px] text-[#7D6452] mt-1">{body || "Your message…"}</div>
                {tone === "premium" && <span className={`inline-block mt-2 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r ${previewTone.cls} text-white uppercase`}>✨ Premium</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      <div className="lg:col-span-3 space-y-3">
        {listQ.isLoading && <div className="text-xs text-[#A38D7D] p-6 text-center">Loading…</div>}
        {!listQ.isLoading && items.length === 0 && <div className="text-xs text-[#A38D7D] p-10 text-center bg-white/60 border border-[#FFEDD5] rounded-2xl">No broadcasts yet</div>}
        {items.map((b: any) => {
          const Icon = BROADCAST_ICONS.find((i) => i.id === b.icon)?.Icon ?? Sparkles;
          const t = BROADCAST_TONES.find((x) => x.id === b.tone) ?? BROADCAST_TONES[0];
          return (
            <div key={b.id} className={`rounded-2xl bg-white border ${b.is_active ? "border-[#FFEDD5]" : "border-gray-200 opacity-60"} shadow-sm p-4`}>
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.cls} flex items-center justify-center shadow-md shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm">{b.title}</div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => toggleMut.mutate({ id: b.id, is_active: !b.is_active })} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${b.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                        {b.is_active ? "Active" : "Inactive"}
                      </button>
                      <button onClick={() => { if (confirm("Delete?")) delMut.mutate(b.id); }} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="text-[11.5px] text-[#7D6452] mt-1 whitespace-pre-wrap">{b.body}</div>
                  <div className="text-[10px] text-[#A38D7D] mt-2">{new Date(b.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// Errors Tab — runtime error / bug viewer (admin debugging)
// ============================================================
function ErrorsTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListErrors);
  const statsFn = useServerFn(adminErrorStats);
  const resolveFn = useServerFn(adminResolveError);
  const deleteFn = useServerFn(adminDeleteError);
  const clearFn = useServerFn(adminClearResolvedErrors);
  const [source, setSource] = useState<string>("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const stats = useQuery({
    queryKey: ["adminErrorStats"],
    queryFn: () => statsFn(),
    refetchInterval: 30_000,
  });
  const rows = useQuery({
    queryKey: ["adminListErrors", source, onlyOpen],
    queryFn: () => listFn(),
    refetchInterval: 15_000,
  });

  const resolveM = useMutation({
    mutationFn: (v: { id: string; is_resolved: boolean }) => resolveFn({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminListErrors"] });
      qc.invalidateQueries({ queryKey: ["adminErrorStats"] });
    },
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminListErrors"] });
      qc.invalidateQueries({ queryKey: ["adminErrorStats"] });
      toast.success("Deleted");
    },
  });
  const clearM = useMutation({
    mutationFn: () => clearFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminListErrors"] });
      qc.invalidateQueries({ queryKey: ["adminErrorStats"] });
      toast.success("Cleared resolved");
    },
  });

  const sources = Object.keys(stats.data?.bySource ?? {}).sort();

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Total" value={stats.data?.total ?? 0} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatBox label="Last 24h" value={stats.data?.last24h ?? 0} icon={<Clock className="h-4 w-4" />} />
        <StatBox label="Open" value={stats.data?.open ?? 0} icon={<Bot className="h-4 w-4" />} />
        <StatBox label="Sources" value={sources.length} icon={<Info className="h-4 w-4" />} />
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-white/60 backdrop-blur border border-[#FF7E5F]/20 rounded-2xl p-3">
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="text-sm bg-white border border-[#FF7E5F]/30 rounded-lg px-3 py-1.5"
        >
          <option value="">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>{s} ({stats.data?.bySource?.[s] ?? 0})</option>
          ))}
        </select>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
          Only unresolved
        </label>
        <Button size="sm" variant="outline" onClick={() => rows.refetch()}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => { if (confirm("Delete all resolved errors?")) clearM.mutate(); }}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Clear resolved
        </Button>
        <span className="ml-auto text-xs text-[#4A3728]/60">Auto-refresh 15s • cap 10k rows</span>
      </div>

      <div className="bg-white/60 backdrop-blur border border-[#FF7E5F]/20 rounded-2xl overflow-hidden">
        {rows.isLoading ? (
          <div className="p-8 text-center text-[#4A3728]/60">Loading…</div>
        ) : (rows.data?.rows.length ?? 0) === 0 ? (
          <div className="p-8 text-center text-[#4A3728]/60">No errors 🎉</div>
        ) : (
          <ul className="divide-y divide-[#FF7E5F]/15">
            {rows.data?.rows.map((r) => {
              const isOpen = expanded === r.id;
              return (
                <li key={r.id} className="p-3 hover:bg-[#FFF9F5]/60">
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        r.level === "error" ? "bg-red-100 text-red-700"
                        : r.level === "warn" ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {r.level}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#FF7E5F]/15 text-[#FF7E5F] font-semibold">
                      {r.source}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.message}</div>
                      <div className="text-xs text-[#4A3728]/60">
                        {new Date(r.created_at).toLocaleString()}
                        {r.link_id ? ` • link:${r.link_id.slice(0, 8)}` : ""}
                        {r.is_resolved ? " • ✅ resolved" : ""}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setExpanded(isOpen ? null : r.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => resolveM.mutate({ id: r.id, is_resolved: !r.is_resolved })}
                      title={r.is_resolved ? "Mark unresolved" : "Mark resolved"}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { if (confirm("Delete this error?")) deleteM.mutate(r.id); }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  {isOpen && (
                    <div className="mt-2 ml-2 space-y-2 text-xs">
                      {r.context && (
                        <pre className="bg-black/5 rounded p-2 overflow-x-auto whitespace-pre-wrap break-all">
                          {typeof r.context === "string" ? r.context : JSON.stringify(r.context, null, 2)}
                        </pre>
                      )}
                      {r.stack && (
                        <pre className="bg-black/5 rounded p-2 overflow-x-auto whitespace-pre-wrap break-all max-h-64">
                          {r.stack}
                        </pre>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white/60 backdrop-blur border border-[#FF7E5F]/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-[#4A3728]/70 text-xs">
        {icon} {label}
      </div>
      <div className="text-2xl font-bold mt-1">{value.toLocaleString()}</div>
    </div>
  );
}

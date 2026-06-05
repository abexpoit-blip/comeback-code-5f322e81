import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import { useState } from "react";
import { Crown, Globe, Plus, Check, AlertCircle, ShieldCheck, Trash2, RefreshCw, Copy } from "lucide-react";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
import "@supabase/supabase-js";
import "./createMiddleware-BvN2ghIY.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const listCustomDomains = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("97f77b17ad7cf2ea7548d5f8a98b6bb3feb57085522b172b3b8daff60ac9017a"));
const addCustomDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({
  domain: z.string().min(3).max(253)
}).parse(data)).handler(createSsrRpc("e7589b16b723e1e56a17039009a41da916ef39341d3d6dcf84ccf302baeacb6d"));
const verifyCustomDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({
  id: z.string().uuid()
}).parse(data)).handler(createSsrRpc("36ce9ea947ca1461e16afeef4233a775a41ef56f3623c89caef3ce56d0b6c85c"));
const deleteCustomDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({
  id: z.string().uuid()
}).parse(data)).handler(createSsrRpc("2e532c20c177a32bf49dba1d988d1f7cf98a283132625522d12e743cc12f8734"));
const display = {
  fontFamily: "'Space Grotesk', sans-serif"
};
function DomainsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listCustomDomains);
  const addFn = useServerFn(addCustomDomain);
  const verifyFn = useServerFn(verifyCustomDomain);
  const deleteFn = useServerFn(deleteCustomDomain);
  const q = useQuery({
    queryKey: ["custom-domains"],
    queryFn: () => listFn(),
    staleTime: 3e4
  });
  const [newDomain, setNewDomain] = useState("");
  const [actionMsg, setActionMsg] = useState(null);
  const add = useMutation({
    mutationFn: (domain) => addFn({
      data: {
        domain
      }
    }),
    onSuccess: () => {
      setNewDomain("");
      setActionMsg({
        type: "ok",
        text: "Domain added. Now add the DNS records below and verify."
      });
      qc.invalidateQueries({
        queryKey: ["custom-domains"]
      });
    },
    onError: (e) => setActionMsg({
      type: "err",
      text: e?.message ?? "Failed to add domain"
    })
  });
  const verify = useMutation({
    mutationFn: (id) => verifyFn({
      data: {
        id
      }
    }),
    onSuccess: (res) => {
      setActionMsg({
        type: res.ok ? "ok" : "err",
        text: res.message
      });
      qc.invalidateQueries({
        queryKey: ["custom-domains"]
      });
    },
    onError: (e) => setActionMsg({
      type: "err",
      text: e?.message ?? "Verification failed"
    })
  });
  const del = useMutation({
    mutationFn: (id) => deleteFn({
      data: {
        id
      }
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["custom-domains"]
    })
  });
  if (q.isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center text-[#7D6452]", children: "Loading…" });
  }
  if (q.isError) {
    return /* @__PURE__ */ jsx("div", { className: "p-6 lg:p-10 max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "p-8 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-bold mb-2", children: "Could not load domains" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: q.error?.message ?? "Unknown error" }),
      /* @__PURE__ */ jsx("button", { onClick: () => q.refetch(), className: "mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold", children: "Retry" })
    ] }) });
  }
  const data = q.data;
  if (!data) return null;
  if (!data.isPaid) {
    return /* @__PURE__ */ jsx("div", { className: "p-6 lg:p-10 max-w-3xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "p-10 rounded-3xl bg-white/85 border border-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,126,95,0.12)] text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white shadow-lg shadow-orange-500/30 mb-5", children: /* @__PURE__ */ jsx(Crown, { className: "w-7 h-7" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-[#2D1B0D]", style: display, children: "Custom Domains — Pro feature" }),
      /* @__PURE__ */ jsxs("p", { className: "text-[#5D4538] mt-3 max-w-md mx-auto", children: [
        "Use your own domain (e.g. ",
        /* @__PURE__ */ jsx("span", { className: "font-mono text-[#2D1B0D]", children: "links.yoursite.com" }),
        ") for every smart link. Available on all paid plans."
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/upgrade", className: "inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white font-bold shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-transform", children: [
        /* @__PURE__ */ jsx(Crown, { className: "w-4 h-4" }),
        " Upgrade now"
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-10 space-y-8 max-w-[1200px] mx-auto", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-[#FF7E5F] font-bold mb-2", children: "Branded Links" }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl lg:text-4xl font-bold text-[#2D1B0D] tracking-tight", style: display, children: "Custom Domains" }),
      /* @__PURE__ */ jsxs("p", { className: "text-[#5D4538] text-sm mt-2 max-w-2xl", children: [
        "Serve your smart links from your own domain. Add a subdomain (recommended) like ",
        /* @__PURE__ */ jsx("span", { className: "font-mono text-[#2D1B0D]", children: "go.yoursite.com" }),
        " and verify ownership via DNS."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "p-6 rounded-3xl bg-white/85 border border-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,126,95,0.08)]", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-[#2D1B0D] uppercase tracking-wider mb-4", style: display, children: "Add a new domain" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-[#FFEDD5] focus-within:border-[#FF7E5F]/50 transition", children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-[#7D6452] shrink-0" }),
          /* @__PURE__ */ jsx("input", { value: newDomain, onChange: (e) => setNewDomain(e.target.value), placeholder: "go.yoursite.com", className: "bg-transparent flex-1 outline-none text-sm text-[#2D1B0D] placeholder:text-[#A38D7D] font-mono" })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => add.mutate(newDomain), disabled: !newDomain.trim() || add.isPending, className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white font-bold shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          " ",
          add.isPending ? "Adding…" : "Add domain"
        ] })
      ] }),
      actionMsg && /* @__PURE__ */ jsxs("div", { className: `mt-4 flex items-start gap-2 p-3 rounded-xl text-sm ${actionMsg.type === "ok" ? "bg-emerald-500/10 border border-emerald-400/40 text-emerald-700" : "bg-rose-500/10 border border-rose-400/40 text-rose-700"}`, children: [
        actionMsg.type === "ok" ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 mt-0.5 shrink-0" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: actionMsg.text })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "space-y-4", children: data.domains.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-10 rounded-3xl bg-white/70 border border-dashed border-[#FFD9C4] text-center", children: [
      /* @__PURE__ */ jsx(Globe, { className: "w-10 h-10 text-[#FEB47B] mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#5D4538]", children: "No domains yet. Add your first one above to get started." })
    ] }) : data.domains.map((dom) => /* @__PURE__ */ jsx(DomainCard, { dom, onVerify: () => verify.mutate(dom.id), onDelete: () => {
      if (confirm(`Delete ${dom.domain}? Links using this domain will stop working.`)) del.mutate(dom.id);
    }, verifying: verify.isPending }, dom.id)) })
  ] });
}
function DomainCard({
  dom,
  onVerify,
  onDelete,
  verifying
}) {
  const [open, setOpen] = useState(!dom.verified);
  return /* @__PURE__ */ jsxs("div", { className: "p-6 rounded-3xl bg-white/85 border border-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,126,95,0.08)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7E5F]/20 to-[#FEB47B]/20 border border-[#FFEDD5] flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-[#FF7E5F]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-[#2D1B0D] font-mono truncate", style: display, children: dom.domain }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#7D6452] mt-0.5", children: [
          "Added ",
          new Date(dom.created_at).toLocaleDateString(),
          dom.verified_at && /* @__PURE__ */ jsxs(Fragment, { children: [
            " · Verified ",
            new Date(dom.verified_at).toLocaleDateString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        dom.verified ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-700 text-xs font-bold", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
          " Verified"
        ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-700 text-xs font-bold", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }),
          " Pending DNS"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setOpen(!open), className: "px-3 py-1.5 rounded-xl text-xs font-semibold text-[#5D4538] hover:bg-[#FFEDD5]/60 transition", children: open ? "Hide" : "Setup" }),
        /* @__PURE__ */ jsx("button", { onClick: onDelete, className: "p-2 rounded-xl text-rose-600 hover:bg-rose-500/10 transition", title: "Delete domain", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
      ] })
    ] }),
    open && /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-6 border-t border-[#FFEDD5] space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs uppercase tracking-[0.2em] text-[#7D6452] font-bold mb-3", children: "DNS Records (add at your registrar)" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(DnsRow, { type: "CNAME", name: dom.domain, value: "sleepox.com" }),
          /* @__PURE__ */ jsx(DnsRow, { type: "TXT", name: `_sleepox-verify.${dom.domain}`, value: dom.verification_token })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-4 rounded-2xl bg-[#FFF5EC] border border-[#FFEDD5]", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#5D4538] leading-relaxed", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-[#2D1B0D]", children: "How it works:" }),
        " Point a CNAME from your domain to ",
        /* @__PURE__ */ jsx("span", { className: "font-mono", children: "sleepox.com" }),
        ", then add the TXT record above to prove ownership. DNS changes can take a few minutes (up to 24h on some providers)."
      ] }) }),
      /* @__PURE__ */ jsxs("button", { onClick: onVerify, disabled: verifying, className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D1B0D] text-white text-sm font-bold hover:bg-[#3D2818] disabled:opacity-50 transition", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${verifying ? "animate-spin" : ""}` }),
        verifying ? "Checking DNS…" : dom.verified ? "Re-check" : "Verify DNS"
      ] })
    ] })
  ] });
}
function DnsRow({
  type,
  name,
  value
}) {
  const [copied, setCopied] = useState(null);
  const copy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-white border border-[#FFEDD5] text-xs", children: [
    /* @__PURE__ */ jsx("span", { className: "col-span-2 inline-flex items-center justify-center px-2 py-1 rounded-md bg-[#FF7E5F]/15 text-[#FF7E5F] font-bold font-mono", children: type }),
    /* @__PURE__ */ jsxs("div", { className: "col-span-5 min-w-0 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-[#7D6452] shrink-0", children: "Name" }),
      /* @__PURE__ */ jsx("code", { className: "text-[#2D1B0D] font-mono truncate", title: name, children: name }),
      /* @__PURE__ */ jsx("button", { onClick: () => copy("n", name), className: "ml-auto p-1 text-[#7D6452] hover:text-[#FF7E5F]", title: "Copy", children: copied === "n" ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "col-span-5 min-w-0 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase text-[#7D6452] shrink-0", children: "Value" }),
      /* @__PURE__ */ jsx("code", { className: "text-[#2D1B0D] font-mono truncate", title: value, children: value }),
      /* @__PURE__ */ jsx("button", { onClick: () => copy("v", value), className: "ml-auto p-1 text-[#7D6452] hover:text-[#FF7E5F]", title: "Copy", children: copied === "v" ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }) })
    ] })
  ] });
}
export {
  DomainsPage as component
};

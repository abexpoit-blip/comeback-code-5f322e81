import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, LifeBuoy, XCircle, Sparkles, Send, MessageCircle, CheckCircle2, Clock } from "lucide-react";
import { g as getSupportStatus, l as listMyTickets, c as createSupportTicket } from "./support.functions-DgNvoRAk.js";
import "./server-BTtYLKd6.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./auth-middleware-V_HzM7yr.js";
import "@supabase/supabase-js";
import "./createMiddleware-BvN2ghIY.js";
const display = {
  fontFamily: "'Outfit', system-ui, sans-serif"
};
function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1e3);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
function SupportPage() {
  const qc = useQueryClient();
  const status = useServerFn(getSupportStatus);
  const list = useServerFn(listMyTickets);
  const create = useServerFn(createSupportTicket);
  const statusQ = useQuery({
    queryKey: ["support-status"],
    queryFn: () => status(),
    staleTime: 6e4
  });
  const ticketsQ = useQuery({
    queryKey: ["my-tickets"],
    queryFn: () => list(),
    staleTime: 3e4
  });
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const createMut = useMutation({
    mutationFn: (d) => create({
      data: d
    }),
    onSuccess: () => {
      toast.success("Message sent — we'll reply soon");
      setSubject("");
      setMessage("");
      qc.invalidateQueries({
        queryKey: ["my-tickets"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to send")
  });
  const enabled = statusQ.data?.enabled !== false;
  function submit(e) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return toast.error("Subject and message required");
    if (message.length > 4e3) return toast.error("Message too long (max 4000 chars)");
    createMut.mutate({
      subject: subject.trim(),
      message: message.trim()
    });
  }
  const tickets = ticketsQ.data ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#FFF9F5] text-[#2D1B0D]", style: display, children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-[-20%] left-[-10%] w-[55%] h-[55%] bg-[#FF7E5F]/12 blur-[160px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#FEB47B]/15 blur-[160px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm shadow-orange-900/5 px-5 py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "w-9 h-9 rounded-xl bg-[#FFF9F5] border border-[#FFEDD5] flex items-center justify-center text-[#7D6452] hover:text-[#FF7E5F]", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center shadow-md shadow-orange-500/30", children: /* @__PURE__ */ jsx(LifeBuoy, { className: "w-4.5 h-4.5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-lg font-extrabold text-[#2D1B0D] leading-tight", children: "Support" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#A38D7D]", children: "Get help from the Sleepox team" })
          ] })
        ] })
      ] }),
      !enabled && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-amber-50 border border-amber-200 p-5 flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(XCircle, { className: "w-5 h-5 text-amber-600 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-amber-900 text-sm", children: "Support is temporarily disabled" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-amber-700 mt-1", children: "Our team has paused new tickets. Please check back later." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-5", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white border border-[#FFEDD5] shadow-sm shadow-orange-900/5 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-gradient-to-r from-[#FFF9F5] to-[#FFEDD5]/40 border-b border-[#FFEDD5]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-[#FF7E5F]" }),
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-extrabold", children: "Send a message" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-[#A38D7D] mt-1", children: "We typically reply within 24 hours." })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-[#7D6452] uppercase tracking-wide", children: "Subject" }),
              /* @__PURE__ */ jsx("input", { value: subject, onChange: (e) => setSubject(e.target.value), maxLength: 200, placeholder: "e.g. Cannot create new link", disabled: !enabled, className: "mt-1.5 w-full bg-[#FFF9F5]/70 border border-[#FFEDD5] rounded-xl py-2.5 px-3 text-sm placeholder:text-[#A38D7D] focus:outline-none focus:border-[#FF7E5F]/50 focus:bg-white transition-all disabled:opacity-50" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-[#7D6452] uppercase tracking-wide", children: "Message" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[#A38D7D]", children: [
                  message.length,
                  "/4000"
                ] })
              ] }),
              /* @__PURE__ */ jsx("textarea", { value: message, onChange: (e) => setMessage(e.target.value.slice(0, 4e3)), rows: 8, placeholder: "Describe your issue in detail…", disabled: !enabled, className: "mt-1.5 w-full bg-[#FFF9F5]/70 border border-[#FFEDD5] rounded-xl py-2.5 px-3 text-sm placeholder:text-[#A38D7D] focus:outline-none focus:border-[#FF7E5F]/50 focus:bg-white transition-all resize-none disabled:opacity-50" })
            ] }),
            /* @__PURE__ */ jsxs("button", { type: "submit", disabled: !enabled || createMut.isPending, className: "w-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", children: [
              /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }),
              createMut.isPending ? "Sending…" : "Send message"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white border border-[#FFEDD5] shadow-sm shadow-orange-900/5 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-gradient-to-r from-[#FFF9F5] to-[#FFEDD5]/40 border-b border-[#FFEDD5] flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MessageCircle, { className: "w-4 h-4 text-[#FF7E5F]" }),
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-extrabold", children: "My tickets" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[#A38D7D]", children: [
              tickets.length,
              " total"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "divide-y divide-[#FFEDD5]/70 max-h-[640px] overflow-y-auto", children: [
            ticketsQ.isLoading && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-xs text-[#A38D7D]", children: "Loading…" }),
            !ticketsQ.isLoading && tickets.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-10 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-[#FFF9F5] border border-[#FFEDD5] flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(MessageCircle, { className: "w-6 h-6 text-[#A38D7D]" }) }),
              /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: "No tickets yet" }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#A38D7D] mt-1", children: "Your messages will appear here." })
            ] }),
            tickets.map((t) => /* @__PURE__ */ jsxs("details", { className: "group", children: [
              /* @__PURE__ */ jsxs("summary", { className: "px-5 py-4 cursor-pointer hover:bg-[#FFF9F5]/70 list-none flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(StatusBadge, { status: t.status }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[13px] font-bold text-[#2D1B0D] truncate", children: t.subject }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#7D6452] line-clamp-1 mt-0.5", children: t.message }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[#A38D7D] mt-1", children: timeAgo(t.created_at) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-5 pb-5 pt-1 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-[#FFF9F5] border border-[#FFEDD5] p-3.5", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-[#A38D7D] uppercase tracking-wide mb-1.5", children: "Your message" }),
                  /* @__PURE__ */ jsx("div", { className: "text-[12.5px] text-[#2D1B0D] whitespace-pre-wrap leading-relaxed", children: t.message })
                ] }),
                t.admin_reply ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-50/30 border border-emerald-200 p-3.5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-emerald-700 uppercase tracking-wide", children: "Sleepox team reply" }),
                    t.replied_at && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-600/70 ml-auto", children: timeAgo(t.replied_at) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-[12.5px] text-[#2D1B0D] whitespace-pre-wrap leading-relaxed", children: t.admin_reply })
                ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-amber-50/60 border border-amber-200/70 p-3 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-amber-600" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] text-amber-700 font-medium", children: "Awaiting reply from our team…" })
                ] })
              ] })
            ] }, t.id))
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
function StatusBadge({
  status
}) {
  if (status === "replied") {
    return /* @__PURE__ */ jsxs("span", { className: "shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9.5px] font-extrabold uppercase tracking-wide", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
      " Replied"
    ] });
  }
  if (status === "closed") {
    return /* @__PURE__ */ jsxs("span", { className: "shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFEDD5] text-[#7D6452] text-[9.5px] font-extrabold uppercase tracking-wide", children: [
      /* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3" }),
      " Closed"
    ] });
  }
  return /* @__PURE__ */ jsxs("span", { className: "shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9.5px] font-extrabold uppercase tracking-wide", children: [
    /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
    " Open"
  ] });
}
export {
  SupportPage as component
};

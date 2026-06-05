import { c as createSsrRpc } from "./createSsrRpc-DJC6aB8i.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
const getSupportStatus = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4232df71ecb46ace539231cd45c37cb0e19c0e6e446eae681af43cbbd88b9289"));
const toggleSupport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  enabled: z.boolean()
}).parse(d)).handler(createSsrRpc("60f71deb45e0653765a6811c7c1a3529c1101d76a901ed484be4f73850c2cb25"));
const createSupportTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(4e3)
}).parse(d)).handler(createSsrRpc("42b7e30546b5a7c03d1813ff23502b3d12d813b160186ef0bd9c4bac61108f25"));
const listMyTickets = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("fc61c87057e42ff737d09bcfb7757cc796eae0cea9ebee443116a9fcdf1ff026"));
const adminListTickets = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  status: z.enum(["all", "open", "replied", "closed"]).default("all"),
  limit: z.number().int().min(1).max(200).default(100)
}).partial().parse(d ?? {})).handler(createSsrRpc("e1a55e5c6b99a0b0eb865c8e192cf8cc606999b4745cddbcbe8f7be5ad4d1653"));
const adminReplyTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ticket_id: z.string().uuid(),
  reply: z.string().trim().min(1).max(4e3)
}).parse(d)).handler(createSsrRpc("0915f3d798cdd971c6853d37be243476661e93e2223a3dd942d93a41800d2aea"));
const adminCloseTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ticket_id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("acbaed78f6c68877955a629d7c4e5d50cb08a43069712ca87cf3f699e24ffb82"));
const adminDeleteTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ticket_id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("277c4fd6385e870fb41a79493b7bcc699df07ca1b5b69d6fe557c120fead684e"));
export {
  adminListTickets as a,
  adminReplyTicket as b,
  createSupportTicket as c,
  adminCloseTicket as d,
  adminDeleteTicket as e,
  getSupportStatus as g,
  listMyTickets as l,
  toggleSupport as t
};

import { c as createSsrRpc } from "./createSsrRpc-DJC6aB8i.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
const getPrimaryShortenerDomain = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("87126bafbcd309dc27cc5706d57437ace030670bcca11c9f6c75b71d93c73851"));
const listShortenerDomains = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("675f3c6e35cdf9e21799e99049d50a107145929e859f67b3331def446d0e3442"));
const addShortenerDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  domain: z.string().min(3).max(253),
  note: z.string().max(200).optional()
}).parse(d)).handler(createSsrRpc("7a5acc626a5a3f98becb442cb561fab68cb2b6e24f8d94b7460dace3576ce691"));
const verifyShortenerDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("a058660ea02ba7cbf12e063486ed515d42da7fbb053c48b5551c124731af3a7a"));
const setPrimaryShortenerDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("0c66c49165651b4ffab6e22b0cdae4c0614d52034a7a175f9d39129dd2e095bc"));
const toggleShortenerDomainActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_active: z.boolean()
}).parse(d)).handler(createSsrRpc("1adc7e4f1eabc87ea6bb2c83d5b28ef7a15be1a77652472108c24d5bfa2d2046"));
const deleteShortenerDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("920f8c9263af78ae515fa3fc38f21082c4c859114bcbefa3150c21d29585ab4b"));
const listActiveBroadcasts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a7a24c46a80d2424e0647d513c6d94429d1af96678d05dea6973b6631153a0af"));
const markBroadcastRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  broadcast_id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("e8206784df06d687144686f3c096fb642bc8f03dc61db390ec6b936eba7283ad"));
const markAllBroadcastsRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("f016c98b2e817b989ed022d0201e783a8e5be614784a801b60e1a421f7528d47"));
const adminListBroadcasts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("04e872fb0d01ba1b3e863172879ed5bde0335b90ed47f192a2945b590b8f71ac"));
const adminCreateBroadcast = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(2e3),
  icon: z.string().trim().min(1).max(64).default("sparkles"),
  tone: z.enum(["info", "success", "warning", "premium"]).default("premium"),
  expires_at: z.string().datetime().nullable().optional()
}).parse(d)).handler(createSsrRpc("5f6eccfa87bb74e880ef5c7b6be6f2c8b580ab981c8d09f4c4528e4c4c437621"));
const adminToggleBroadcast = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_active: z.boolean()
}).parse(d)).handler(createSsrRpc("1448d5673a2cf8b026dbbfdb5c8375af6b36194158e063a558d3b3c15042688f"));
const adminDeleteBroadcast = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("cd4a556407e6a4aeeae66831a19a9b2ef423e0fa43b0b03e9e06b72b0678b013"));
export {
  markAllBroadcastsRead as a,
  listShortenerDomains as b,
  addShortenerDomain as c,
  deleteShortenerDomain as d,
  adminListBroadcasts as e,
  adminCreateBroadcast as f,
  getPrimaryShortenerDomain as g,
  adminToggleBroadcast as h,
  adminDeleteBroadcast as i,
  listActiveBroadcasts as l,
  markBroadcastRead as m,
  setPrimaryShortenerDomain as s,
  toggleShortenerDomainActive as t,
  verifyShortenerDomain as v
};

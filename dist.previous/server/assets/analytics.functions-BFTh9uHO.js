import { c as createSsrRpc } from "./createSsrRpc-DJC6aB8i.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
const getAnalyticsData = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d91dfdd74db1fc0d1565dac60a8b653133fd25dd464f569abbfc658bab0298fe"));
const getCohortRetention = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5075a7024ebc8397988f2bd71e539d61981dcba2b1db7fec21131e0a42a1e496"));
const getLinkDrilldown = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({
  linkId: z.string().uuid()
}).parse(input)).handler(createSsrRpc("ececc0c31830af1c42822bd58ec388ba09a755e000f68f0879bf287140f6ceb4"));
const getLiveFeed = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ebfe3b6be396b23758b2dee9f7bf72e509a2996f4a6521fa7f0b9149d1278264"));
export {
  getAnalyticsData as a,
  getCohortRetention as b,
  getLinkDrilldown as c,
  getLiveFeed as g
};

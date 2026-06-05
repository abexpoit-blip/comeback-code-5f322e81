import { AsyncLocalStorage } from "node:async_hooks";
import { H3Event, toResponse } from "h3-v2";
import { rootRouteId, parseRedirect, isRedirect, defaultSerovalPlugins, makeSerovalPlugin, createRawStreamRPCPlugin, invariant, isNotFound, resolveManifestAssetLink, createSerializationAdapter, isResolvedRedirect, executeRewriteInput } from "@tanstack/router-core";
import { toCrossJSONStream, fromJSON, toCrossJSONAsync } from "seroval";
import { createMemoryHistory } from "@tanstack/history";
import { mergeHeaders } from "@tanstack/router-core/ssr/client";
import { getNormalizedURL, getOrigin, attachRouterServerSsrUtils } from "@tanstack/router-core/ssr/server";
import "react";
import { RouterProvider } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
import { defineHandlerCallback, renderRouterToStream } from "@tanstack/react-router/ssr/server";
function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
  request,
  router,
  responseHeaders,
  children: /* @__PURE__ */ jsx(StartServer, { router })
}));
var GLOBAL_EVENT_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
  return typeof value.then === "function";
}
function getSetCookieValues(headers) {
  const headersWithSetCookie = headers;
  if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
  const value = headers.get("set-cookie");
  return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
  if (response.ok) return;
  const eventSetCookies = getSetCookieValues(event.res.headers);
  if (eventSetCookies.length === 0) return;
  const responseSetCookies = getSetCookieValues(response.headers);
  response.headers.delete("set-cookie");
  for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
  for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function attachResponseHeaders(value, event) {
  if (isPromiseLike(value)) return value.then((resolved) => {
    if (resolved instanceof Response) mergeEventResponseHeaders(resolved, event);
    return resolved;
  });
  if (value instanceof Response) mergeEventResponseHeaders(value, event);
  return value;
}
function requestHandler(handler) {
  return (request, requestOpts) => {
    let h3Event;
    try {
      h3Event = new H3Event(request);
    } catch (error) {
      if (error instanceof URIError) return new Response(null, {
        status: 400,
        statusText: "Bad Request"
      });
      throw error;
    }
    return toResponse(attachResponseHeaders(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event), h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return event.h3Event;
}
function getRequest() {
  return getH3Event().req;
}
function getResponse() {
  return getH3Event().res;
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
async function getStartManifest(matchedRoutes) {
  const { tsrStartManifest } = await import("./_tanstack-start-manifest_v-FzHqMzs-.js");
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let injectedHeadScripts;
  return {
    manifest: {
      inlineCss: startManifest.inlineCss,
      routes: Object.fromEntries(Object.entries(startManifest.routes).flatMap(([k, v]) => {
        const result = {};
        let hasData = false;
        if (v.preloads && v.preloads.length > 0) {
          result["preloads"] = v.preloads;
          hasData = true;
        }
        if (v.assets && v.assets.length > 0) {
          result["assets"] = v.assets;
          hasData = true;
        }
        if (!hasData) return [];
        return [[k, result]];
      }))
    },
    clientEntry: startManifest.clientEntry,
    injectedHeadScripts
  };
}
const manifest = {
  "4232df71ecb46ace539231cd45c37cb0e19c0e6e446eae681af43cbbd88b9289": {
    functionName: "getSupportStatus_createServerFn_handler",
    importer: () => import("./support.functions-CV_UXyor.js")
  },
  "60f71deb45e0653765a6811c7c1a3529c1101d76a901ed484be4f73850c2cb25": {
    functionName: "toggleSupport_createServerFn_handler",
    importer: () => import("./support.functions-CV_UXyor.js")
  },
  "42b7e30546b5a7c03d1813ff23502b3d12d813b160186ef0bd9c4bac61108f25": {
    functionName: "createSupportTicket_createServerFn_handler",
    importer: () => import("./support.functions-CV_UXyor.js")
  },
  "fc61c87057e42ff737d09bcfb7757cc796eae0cea9ebee443116a9fcdf1ff026": {
    functionName: "listMyTickets_createServerFn_handler",
    importer: () => import("./support.functions-CV_UXyor.js")
  },
  "e1a55e5c6b99a0b0eb865c8e192cf8cc606999b4745cddbcbe8f7be5ad4d1653": {
    functionName: "adminListTickets_createServerFn_handler",
    importer: () => import("./support.functions-CV_UXyor.js")
  },
  "0915f3d798cdd971c6853d37be243476661e93e2223a3dd942d93a41800d2aea": {
    functionName: "adminReplyTicket_createServerFn_handler",
    importer: () => import("./support.functions-CV_UXyor.js")
  },
  "acbaed78f6c68877955a629d7c4e5d50cb08a43069712ca87cf3f699e24ffb82": {
    functionName: "adminCloseTicket_createServerFn_handler",
    importer: () => import("./support.functions-CV_UXyor.js")
  },
  "277c4fd6385e870fb41a79493b7bcc699df07ca1b5b69d6fe557c120fead684e": {
    functionName: "adminDeleteTicket_createServerFn_handler",
    importer: () => import("./support.functions-CV_UXyor.js")
  },
  "429a892ce3afcdb74269241f68462ccb5c71abac5ef0f92fdf29c632780098fe": {
    functionName: "listCloakingRules_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "686ccbae4aa9bb20e0ea6c9665df77b4b4e2543bf637024825b76f12da0c7c7b": {
    functionName: "upsertCloakingRule_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "b818bae25070c1caab5b6148743dccaf350c6697de0a1cfea4e644ae8dafea27": {
    functionName: "deleteCloakingRule_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "bb932350566fb237b4471865f428594c56c9b2f3d3dd80a487605a1bbbcf89f8": {
    functionName: "listReferrerRules_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "b583455f5cff3566369da96706471e961fcfdfb1c9ae508f32ce8ddb1cc59cf4": {
    functionName: "upsertReferrerRule_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "3be1e45c0f87224fa53a4c55d61188ea18fce368cdda1d5711196fd65386b877": {
    functionName: "deleteReferrerRule_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "ead8ba5bbc17c957db5b7b7ea4241cd9ecb9d3417e366e3197efe235a16c9801": {
    functionName: "listBotFingerprints_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "8f677e90db99fc42aab7d9bc95d7cab1646c568d4e969e3254a2bc670cbe2610": {
    functionName: "toggleFingerprintBlock_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "3c49897021118c3ed98c969c589c9aaed8556494877a40d3962d664ecd84a54f": {
    functionName: "listCountryTiers_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "efa9146476424c85a56da9b1af291e395fb192690477cdf7e3da9d6752715515": {
    functionName: "upsertCountryTier_createServerFn_handler",
    importer: () => import("./smart-filter.functions-iAyDkKZM.js")
  },
  "d91dfdd74db1fc0d1565dac60a8b653133fd25dd464f569abbfc658bab0298fe": {
    functionName: "getAnalyticsData_createServerFn_handler",
    importer: () => import("./analytics.functions-bNZaNNfi.js")
  },
  "5075a7024ebc8397988f2bd71e539d61981dcba2b1db7fec21131e0a42a1e496": {
    functionName: "getCohortRetention_createServerFn_handler",
    importer: () => import("./analytics.functions-bNZaNNfi.js")
  },
  "ececc0c31830af1c42822bd58ec388ba09a755e000f68f0879bf287140f6ceb4": {
    functionName: "getLinkDrilldown_createServerFn_handler",
    importer: () => import("./analytics.functions-bNZaNNfi.js")
  },
  "ebfe3b6be396b23758b2dee9f7bf72e509a2996f4a6521fa7f0b9149d1278264": {
    functionName: "getLiveFeed_createServerFn_handler",
    importer: () => import("./analytics.functions-bNZaNNfi.js")
  },
  "610029ca7d9b6bceabdd6889b6f13177b782af71484aa1cb6ff2caf36df0895e": {
    functionName: "createInvoice_createServerFn_handler",
    importer: () => import("./billing.functions-DXw-SmSY.js")
  },
  "6b55f242e5fa3501a76b0b01777d42d75f2340733740a9ab869f7911326c4616": {
    functionName: "getMyOrders_createServerFn_handler",
    importer: () => import("./billing.functions-DXw-SmSY.js")
  },
  "838f2ceee278914bec7fbf3251251e6d0a1d7d00acfb990c9108a082a40b3e8e": {
    functionName: "getAppSettings_createServerFn_handler",
    importer: () => import("./app-settings.functions-PwJJ4A0a.js")
  },
  "d1362deff3d396bfcdfb8e972cd5bce32a5ae6b6153da6bd4fa9f46a17972103": {
    functionName: "updateAppSettings_createServerFn_handler",
    importer: () => import("./app-settings.functions-PwJJ4A0a.js")
  },
  "a7f658afcf8531c0755b81850e2d5d8f52e9d70a1b734a8953647f110d3c2dd3": {
    functionName: "consumeDailyRedirect_createServerFn_handler",
    importer: () => import("./app-settings.functions-PwJJ4A0a.js")
  },
  "fc54988025651b0d207f9ef4346d9f0fe848ff17785294a4a080cffaee281f4f": {
    functionName: "adminStats_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "e9d1f9e0f31baff21269163071f2773125249b173b93b6f8e082b2bce42ebe50": {
    functionName: "adminClicksTimeseries_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "d6a8b931287a0f523773d181d0cdfe81f38362ddfcda3bfa170df7cd2f5df4af": {
    functionName: "adminTopCountries_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "0e90fd33773a8111e321610afa0606cc9a87489f3f60e05f00c5709ad8108c33": {
    functionName: "adminTopUsers_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "4f72212c03dfc54e46237b80651dc0f9cf9f5e97732364103f0eb83f7c880e8d": {
    functionName: "adminRevenueTimeseries_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240": {
    functionName: "adminListUsers_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "3bba96bfc803ffdceb8e317d49ead43f2463bee72ef9463446d363dc12f76f2a": {
    functionName: "adminBanUser_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "429be1996cdbaebc10b8a9ffd00e479d3f75da799e8cfbdf703cce1c208cf72e": {
    functionName: "adminBulkBan_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "ba26241d9710067ed0bb27d85639b89098faca09409c040f0a1c693a434ff0c5": {
    functionName: "adminResetUserQuota_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "961c1f6e571cb978c4db99692216cfc4db73f80d629ff4309caa54253d55af80": {
    functionName: "adminBulkSetPlan_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "d1d8fc22649bbd4178512d2170e1f2caac12739f826880397ec7b7ce92c4fee3": {
    functionName: "adminUserDetail_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "96c99aa3dd88135d60c64c1eea70683648bac8e4e78316f2766bb02e6477ec27": {
    functionName: "adminSetUserPlan_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "dc901b8e1718d3ea16d5ca66ca961b0afc97b83e5384a842ab3c033287b034f4": {
    functionName: "adminListPackages_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "25b3f53200b03f55d2bc6f18dd57ce0575af2c8da2f57e383777ad20e4dfe210": {
    functionName: "adminListAllPackages_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "6238adf314c6d3432e0d656a8ed2d8f7bda874a68c1f9113dde280e2603b4218": {
    functionName: "adminUpsertPackage_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "2c2a938ec2a02f0c00614f175abc71712df5999ec6d433b933525cd1326edaee": {
    functionName: "adminDeletePackage_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "b430aad9702f8ebb3ff04f9a78cc5b8b50e903ae182c317c416cdbcbdafef8bc": {
    functionName: "adminListUpgradeRequests_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "3625bd41ba7f34cc9fe752b318a4dfc04dfa48f2701dc591a7b2a1f28e82f5c4": {
    functionName: "adminDecideUpgradeRequest_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "e112ef2416d567fbe50f313cfdf590c06f337e88ce804ed92247ce3f777fc7bd": {
    functionName: "adminListLinks_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "981ab2fa3d1b0f6619cb79089ec9f96c38faa81f558218fc094c10e30b8c0026": {
    functionName: "adminToggleLink_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "b7b62abb0b82435caf96153c195b1f1e0e3fdaee1e2667dd77ae91896c9cdfda": {
    functionName: "adminUpdateLink_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "0e2ae9c383624dcbe1ae741661a947cb4075e1a8a78320f022291534efe342d1": {
    functionName: "adminDeleteLink_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "a96fd93bbab79358adbd0906bf7cbb8c1a1a88da99576de2bba6544e8da2a972": {
    functionName: "adminListBotRules_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "c3bb474c8b7e194e4823f8d59c6b8a487fe138d56c8bb972d7885f14f5f327ae": {
    functionName: "adminUpsertBotRule_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "566f91f009deabf06e642bea2a5406c142e9dbca0a75297ceb4a121d4557dee7": {
    functionName: "adminDeleteBotRule_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "883ab95eedaca3158ce3e9fc0f78869464d8885348b6d8eb345e256ffb2ede47": {
    functionName: "adminListCloakingRules_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "cf47486e50d09b6eb698162f320b2c507b803f00a66684606eaadfc016bcf848": {
    functionName: "adminUpsertCloakingRule_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "43e35d72c5dc104b971ca6cdf1702f552cf26fc1446f39f160db37fff45a1d44": {
    functionName: "adminDeleteCloakingRule_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "b3ee4ed27d9fd8e1fdf02b36d3a774948cc09d7aa1b59761449fb0b5c4b3c45f": {
    functionName: "adminListCountryTiers_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "bbc029988a8868301d1e0e68f6c868fc4afcc02d0e160627aefed8cfc1e22cb4": {
    functionName: "adminUpsertCountryTier_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "2f67e13384324c1918e5d31cee1eeca586ba376d18d3c999fb720a34dbe305f0": {
    functionName: "adminDeleteCountryTier_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "79b1c111fd3073261e14960d349d9c53ec566bd1eec83b4619e6b1d0073ede5c": {
    functionName: "adminImpersonate_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "2f306b1478ea5a15274fa85998ed14690019ed2fc09656989ff9d871a11aaeb3": {
    functionName: "adminListErrors_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "7f07e71321e92ab64d294a23548f879488b2602ad6b63d3b8949ef0f05921bf4": {
    functionName: "adminErrorStats_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "868a5b0f443153927c2b530a5ead388de588b9ee39f33ace7ddbb9b9177bf69f": {
    functionName: "adminResolveError_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "6f6b8913ddd29a34150f0e275ae9d425c8bdf3255c7eca9ea2136352ec40effa": {
    functionName: "adminDeleteError_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "b2a238bc0e0421a51e92d6859fe220111f01d17d8fb65be62287f8f900d01e69": {
    functionName: "adminClearResolvedErrors_createServerFn_handler",
    importer: () => import("./admin.functions-CG6miU_i.js")
  },
  "87126bafbcd309dc27cc5706d57437ace030670bcca11c9f6c75b71d93c73851": {
    functionName: "getPrimaryShortenerDomain_createServerFn_handler",
    importer: () => import("./shortener-domains.functions-CLgRaxSt.js")
  },
  "675f3c6e35cdf9e21799e99049d50a107145929e859f67b3331def446d0e3442": {
    functionName: "listShortenerDomains_createServerFn_handler",
    importer: () => import("./shortener-domains.functions-CLgRaxSt.js")
  },
  "7a5acc626a5a3f98becb442cb561fab68cb2b6e24f8d94b7460dace3576ce691": {
    functionName: "addShortenerDomain_createServerFn_handler",
    importer: () => import("./shortener-domains.functions-CLgRaxSt.js")
  },
  "a058660ea02ba7cbf12e063486ed515d42da7fbb053c48b5551c124731af3a7a": {
    functionName: "verifyShortenerDomain_createServerFn_handler",
    importer: () => import("./shortener-domains.functions-CLgRaxSt.js")
  },
  "0c66c49165651b4ffab6e22b0cdae4c0614d52034a7a175f9d39129dd2e095bc": {
    functionName: "setPrimaryShortenerDomain_createServerFn_handler",
    importer: () => import("./shortener-domains.functions-CLgRaxSt.js")
  },
  "1adc7e4f1eabc87ea6bb2c83d5b28ef7a15be1a77652472108c24d5bfa2d2046": {
    functionName: "toggleShortenerDomainActive_createServerFn_handler",
    importer: () => import("./shortener-domains.functions-CLgRaxSt.js")
  },
  "920f8c9263af78ae515fa3fc38f21082c4c859114bcbefa3150c21d29585ab4b": {
    functionName: "deleteShortenerDomain_createServerFn_handler",
    importer: () => import("./shortener-domains.functions-CLgRaxSt.js")
  },
  "97f77b17ad7cf2ea7548d5f8a98b6bb3feb57085522b172b3b8daff60ac9017a": {
    functionName: "listCustomDomains_createServerFn_handler",
    importer: () => import("./custom-domains.functions-Bbwg3g0U.js")
  },
  "e7589b16b723e1e56a17039009a41da916ef39341d3d6dcf84ccf302baeacb6d": {
    functionName: "addCustomDomain_createServerFn_handler",
    importer: () => import("./custom-domains.functions-Bbwg3g0U.js")
  },
  "36ce9ea947ca1461e16afeef4233a775a41ef56f3623c89caef3ce56d0b6c85c": {
    functionName: "verifyCustomDomain_createServerFn_handler",
    importer: () => import("./custom-domains.functions-Bbwg3g0U.js")
  },
  "2e532c20c177a32bf49dba1d988d1f7cf98a283132625522d12e743cc12f8734": {
    functionName: "deleteCustomDomain_createServerFn_handler",
    importer: () => import("./custom-domains.functions-Bbwg3g0U.js")
  },
  "d92329a3920cdf27b95b7cdd8aad02e139123df62ceb742f8f8e8acfe52088c7": {
    functionName: "listMyLinks_createServerFn_handler",
    importer: () => import("./links.functions-DnrK3RhR.js")
  },
  "44d979f29b3090e2a0d4d5aebf18305dbf03f2b37a638449350f6fa601ee257f": {
    functionName: "getMyProfile_createServerFn_handler",
    importer: () => import("./links.functions-DnrK3RhR.js")
  },
  "6a23396487d12637aec30b2c5bc38775e6a4e107ee1378e0e7da2dfea39445c4": {
    functionName: "getDashboardData_createServerFn_handler",
    importer: () => import("./links.functions-DnrK3RhR.js")
  },
  "da1ead2589edcd03e14bb7e21f054c2a6a483664cebe9882e25cdfa88bf78c07": {
    functionName: "createLink_createServerFn_handler",
    importer: () => import("./links.functions-DnrK3RhR.js")
  },
  "6021030f0f52bde86b3a053c6b16c05f0977afd13e86af1e3a8bd8e3c1ad4d75": {
    functionName: "deleteLink_createServerFn_handler",
    importer: () => import("./links.functions-DnrK3RhR.js")
  },
  "095595cb077a7d492cff96d4e7ec4bf67e6f183f2efdbbaeeb057b114ece087b": {
    functionName: "toggleLink_createServerFn_handler",
    importer: () => import("./links.functions-DnrK3RhR.js")
  },
  "dd4dbb6d223536d6f6795a2cc71cf7d09feaca554621ea796c74d5c952e25c7e": {
    functionName: "updateLinkTemplate_createServerFn_handler",
    importer: () => import("./links.functions-DnrK3RhR.js")
  },
  "a7a24c46a80d2424e0647d513c6d94429d1af96678d05dea6973b6631153a0af": {
    functionName: "listActiveBroadcasts_createServerFn_handler",
    importer: () => import("./broadcasts.functions-n-QHec4Q.js")
  },
  "e8206784df06d687144686f3c096fb642bc8f03dc61db390ec6b936eba7283ad": {
    functionName: "markBroadcastRead_createServerFn_handler",
    importer: () => import("./broadcasts.functions-n-QHec4Q.js")
  },
  "f016c98b2e817b989ed022d0201e783a8e5be614784a801b60e1a421f7528d47": {
    functionName: "markAllBroadcastsRead_createServerFn_handler",
    importer: () => import("./broadcasts.functions-n-QHec4Q.js")
  },
  "04e872fb0d01ba1b3e863172879ed5bde0335b90ed47f192a2945b590b8f71ac": {
    functionName: "adminListBroadcasts_createServerFn_handler",
    importer: () => import("./broadcasts.functions-n-QHec4Q.js")
  },
  "5f6eccfa87bb74e880ef5c7b6be6f2c8b580ab981c8d09f4c4528e4c4c437621": {
    functionName: "adminCreateBroadcast_createServerFn_handler",
    importer: () => import("./broadcasts.functions-n-QHec4Q.js")
  },
  "1448d5673a2cf8b026dbbfdb5c8375af6b36194158e063a558d3b3c15042688f": {
    functionName: "adminToggleBroadcast_createServerFn_handler",
    importer: () => import("./broadcasts.functions-n-QHec4Q.js")
  },
  "cd4a556407e6a4aeeae66831a19a9b2ef423e0fa43b0b03e9e06b72b0678b013": {
    functionName: "adminDeleteBroadcast_createServerFn_handler",
    importer: () => import("./broadcasts.functions-n-QHec4Q.js")
  }
};
async function getServerFnById(id, access) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
  if (!fnModule) {
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    throw new Error("Server function module export not resolved for serverFn ID: " + id);
  }
  return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
var FrameType = {
  JSON: 0,
  CHUNK: 1,
  END: 2,
  ERROR: 3
};
var FRAME_HEADER_SIZE = 9;
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
function isSafeKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function safeObjectMerge(target, source) {
  const result = /* @__PURE__ */ Object.create(null);
  if (target) {
    for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
  }
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
  }
  return result;
}
function createNullProtoObject(source) {
  if (!source) return /* @__PURE__ */ Object.create(null);
  const obj = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
  return obj;
}
var GLOBAL_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return context;
}
var getStartOptions = () => getStartContext().startOptions;
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
  const res = {
    options: resolvedOptions,
    middleware: (middleware) => {
      const newMiddleware = [...resolvedOptions.middleware || []];
      middleware.map((m) => {
        if (TSS_SERVER_FUNCTION_FACTORY in m) {
          if (m.options.middleware) newMiddleware.push(...m.options.middleware);
        } else newMiddleware.push(m);
      });
      const res2 = createServerFn(void 0, {
        ...resolvedOptions,
        middleware: newMiddleware
      });
      res2[TSS_SERVER_FUNCTION_FACTORY] = true;
      return res2;
    },
    inputValidator: (inputValidator) => {
      return createServerFn(void 0, {
        ...resolvedOptions,
        inputValidator
      });
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      const newOptions = {
        ...resolvedOptions,
        extractedFn,
        serverFn
      };
      const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
      extractedFn.method = resolvedOptions.method;
      return Object.assign(async (opts) => {
        const result = await executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...newOptions,
          data: opts?.data,
          headers: opts?.headers,
          signal: opts?.signal,
          fetch: opts?.fetch,
          context: createNullProtoObject()
        });
        const redirect = parseRedirect(result.error);
        if (redirect) throw redirect;
        if (result.error) throw result.error;
        return result.result;
      }, {
        ...extractedFn,
        method: resolvedOptions.method,
        __executeServer: async (opts) => {
          const startContext = getStartContextServerOnly();
          const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
          return await executeMiddleware$1(resolvedMiddleware, "server", {
            ...extractedFn,
            ...opts,
            serverFnMeta: extractedFn.serverFnMeta,
            context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
            request: startContext.request
          }).then((d) => ({
            result: d.result,
            error: d.error,
            context: d.sendContext
          }));
        }
      });
    }
  };
  const fun = (options2) => {
    return createServerFn(void 0, {
      ...resolvedOptions,
      ...options2
    });
  };
  return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
  let flattenedMiddlewares = flattenMiddlewares([...getStartOptions()?.functionMiddleware || [], ...middlewares]);
  if (env === "server") {
    const startContext = getStartContextServerOnly({ throwIfNotFound: false });
    if (startContext?.executedRequestMiddlewares) flattenedMiddlewares = flattenedMiddlewares.filter((m) => !startContext.executedRequestMiddlewares.has(m));
  }
  const callNextMiddleware = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) return ctx;
    try {
      if ("inputValidator" in nextMiddleware.options && nextMiddleware.options.inputValidator && env === "server") ctx.data = await execValidator(nextMiddleware.options.inputValidator, ctx.data);
      let middlewareFn = void 0;
      if (env === "client") {
        if ("client" in nextMiddleware.options) middlewareFn = nextMiddleware.options.client;
      } else if ("server" in nextMiddleware.options) middlewareFn = nextMiddleware.options.server;
      if (middlewareFn) {
        const userNext = async (userCtx = {}) => {
          const result2 = await callNextMiddleware({
            ...ctx,
            ...userCtx,
            context: safeObjectMerge(ctx.context, userCtx.context),
            sendContext: safeObjectMerge(ctx.sendContext, userCtx.sendContext),
            headers: mergeHeaders(ctx.headers, userCtx.headers),
            _callSiteFetch: ctx._callSiteFetch,
            fetch: ctx._callSiteFetch ?? userCtx.fetch ?? ctx.fetch,
            result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
            error: userCtx.error ?? ctx.error
          });
          if (result2.error) throw result2.error;
          return result2;
        };
        const result = await middlewareFn({
          ...ctx,
          next: userNext
        });
        if (isRedirect(result)) return {
          ...ctx,
          error: result
        };
        if (result instanceof Response) return {
          ...ctx,
          result
        };
        if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
        return result;
      }
      return callNextMiddleware(ctx);
    } catch (error) {
      return {
        ...ctx,
        error
      };
    }
  };
  return callNextMiddleware({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || createNullProtoObject(),
    _callSiteFetch: opts.fetch
  });
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware, depth) => {
    if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
    middleware.forEach((m) => {
      if (m.options.middleware) recurse(m.options.middleware, depth + 1);
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares, 0);
  return flattened;
}
async function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = await validator["~standard"].validate(input);
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) return validator.parse(input);
  if (typeof validator === "function") return validator(input);
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    "~types": void 0,
    options: {
      inputValidator: options.inputValidator,
      client: async ({ next, sendContext, fetch: fetch2, ...ctx }) => {
        const payload = {
          ...ctx,
          context: sendContext,
          fetch: fetch2
        };
        return next(await options.extractedFn?.(payload));
      },
      server: async ({ next, ...ctx }) => {
        const result = await options.serverFn?.(ctx);
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
function getDefaultSerovalPlugins() {
  return [...getStartOptions()?.serializationAdapters?.map(makeSerovalPlugin) ?? [], ...defaultSerovalPlugins];
}
var textEncoder = new TextEncoder();
var EMPTY_PAYLOAD = new Uint8Array(0);
function encodeFrame(type, streamId, payload) {
  const frame = new Uint8Array(FRAME_HEADER_SIZE + payload.length);
  frame[0] = type;
  frame[1] = streamId >>> 24 & 255;
  frame[2] = streamId >>> 16 & 255;
  frame[3] = streamId >>> 8 & 255;
  frame[4] = streamId & 255;
  frame[5] = payload.length >>> 24 & 255;
  frame[6] = payload.length >>> 16 & 255;
  frame[7] = payload.length >>> 8 & 255;
  frame[8] = payload.length & 255;
  frame.set(payload, FRAME_HEADER_SIZE);
  return frame;
}
function encodeJSONFrame(json) {
  return encodeFrame(FrameType.JSON, 0, textEncoder.encode(json));
}
function encodeChunkFrame(streamId, chunk) {
  return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
function encodeEndFrame(streamId) {
  return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
function encodeErrorFrame(streamId, error) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return encodeFrame(FrameType.ERROR, streamId, textEncoder.encode(message));
}
function createMultiplexedStream(jsonStream, rawStreams, lateStreamSource) {
  let controller;
  let cancelled = false;
  const readers = [];
  const enqueue = (frame) => {
    if (cancelled) return false;
    try {
      controller.enqueue(frame);
      return true;
    } catch {
      return false;
    }
  };
  const errorOutput = (error) => {
    if (cancelled) return;
    cancelled = true;
    try {
      controller.error(error);
    } catch {
    }
    for (const reader of readers) reader.cancel().catch(() => {
    });
  };
  async function pumpRawStream(streamId, stream) {
    const reader = stream.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) {
          enqueue(encodeEndFrame(streamId));
          return;
        }
        if (!enqueue(encodeChunkFrame(streamId, value))) return;
      }
    } catch (error) {
      enqueue(encodeErrorFrame(streamId, error));
    } finally {
      reader.releaseLock();
    }
  }
  async function pumpJSON() {
    const reader = jsonStream.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) return;
        if (!enqueue(encodeJSONFrame(value))) return;
      }
    } catch (error) {
      errorOutput(error);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
  async function pumpLateStreams() {
    if (!lateStreamSource) return [];
    const lateStreamPumps = [];
    const reader = lateStreamSource.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) break;
        lateStreamPumps.push(pumpRawStream(value.id, value.stream));
      }
    } finally {
      reader.releaseLock();
    }
    return lateStreamPumps;
  }
  return new ReadableStream({
    async start(ctrl) {
      controller = ctrl;
      const pumps = [pumpJSON()];
      for (const [streamId, stream] of rawStreams) pumps.push(pumpRawStream(streamId, stream));
      if (lateStreamSource) pumps.push(pumpLateStreams());
      try {
        const latePumps = (await Promise.all(pumps)).find(Array.isArray);
        if (latePumps && latePumps.length > 0) await Promise.all(latePumps);
        if (!cancelled) try {
          controller.close();
        } catch {
        }
      } catch {
      }
    },
    cancel() {
      cancelled = true;
      for (const reader of readers) reader.cancel().catch(() => {
      });
      readers.length = 0;
    }
  });
}
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var handleServerAction = async ({ request, context, serverFnId }) => {
  const methodUpper = request.method.toUpperCase();
  const url = new URL(request.url);
  const action = await getServerFnById(serverFnId);
  if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
    status: 405,
    headers: { Allow: action.method }
  });
  const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
  if (!serovalPlugins) serovalPlugins = getDefaultSerovalPlugins();
  const contentType = request.headers.get("Content-Type");
  function parsePayload(payload) {
    return fromJSON(payload, { plugins: serovalPlugins });
  }
  return await (async () => {
    try {
      let serializeResult = function(res2) {
        let nonStreamingBody = void 0;
        const alsResponse = getResponse();
        if (res2 !== void 0) {
          const rawStreams = /* @__PURE__ */ new Map();
          let initialPhase = true;
          let lateStreamWriter;
          let lateStreamReadable = void 0;
          const pendingLateStreams = [];
          const plugins = [createRawStreamRPCPlugin((id, stream) => {
            if (initialPhase) {
              rawStreams.set(id, stream);
              return;
            }
            if (lateStreamWriter) {
              lateStreamWriter.write({
                id,
                stream
              }).catch(() => {
              });
              return;
            }
            pendingLateStreams.push({
              id,
              stream
            });
          }), ...serovalPlugins || []];
          let done = false;
          const callbacks = {
            onParse: (value) => {
              nonStreamingBody = value;
            },
            onDone: () => {
              done = true;
            },
            onError: (error) => {
              throw error;
            }
          };
          toCrossJSONStream(res2, {
            refs: /* @__PURE__ */ new Map(),
            plugins,
            onParse(value) {
              callbacks.onParse(value);
            },
            onDone() {
              callbacks.onDone();
            },
            onError: (error) => {
              callbacks.onError(error);
            }
          });
          initialPhase = false;
          if (done && rawStreams.size === 0) return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": "application/json",
              [X_TSS_SERIALIZED]: "true"
            }
          });
          const { readable, writable } = new TransformStream();
          lateStreamReadable = readable;
          lateStreamWriter = writable.getWriter();
          for (const registration of pendingLateStreams) lateStreamWriter.write(registration).catch(() => {
          });
          pendingLateStreams.length = 0;
          const multiplexedStream = createMultiplexedStream(new ReadableStream({
            start(controller) {
              callbacks.onParse = (value) => {
                controller.enqueue(JSON.stringify(value) + "\n");
              };
              callbacks.onDone = () => {
                try {
                  controller.close();
                } catch {
                }
                lateStreamWriter?.close().catch(() => {
                }).finally(() => {
                  lateStreamWriter = void 0;
                });
              };
              callbacks.onError = (error) => {
                controller.error(error);
                lateStreamWriter?.abort(error).catch(() => {
                }).finally(() => {
                  lateStreamWriter = void 0;
                });
              };
              if (nonStreamingBody !== void 0) callbacks.onParse(nonStreamingBody);
              if (done) callbacks.onDone();
            },
            cancel() {
              lateStreamWriter?.abort().catch(() => {
              });
              lateStreamWriter = void 0;
            }
          }), rawStreams, lateStreamReadable);
          return new Response(multiplexedStream, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
              [X_TSS_SERIALIZED]: "true"
            }
          });
        }
        return new Response(void 0, {
          status: alsResponse.status,
          statusText: alsResponse.statusText
        });
      };
      let res = await (async () => {
        if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
          if (methodUpper === "GET") {
            if (false) ;
            invariant();
          }
          const formData = await request.formData();
          const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
          formData.delete(TSS_FORMDATA_CONTEXT);
          const params = {
            context,
            data: formData,
            method: methodUpper
          };
          if (typeof serializedContext === "string") try {
            const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
            if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
          } catch (e) {
            if (false) ;
          }
          return await action(params);
        }
        if (methodUpper === "GET") {
          const payloadParam = url.searchParams.get("payload");
          if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
          const payload2 = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
          payload2.context = safeObjectMerge(payload2.context, context);
          payload2.method = methodUpper;
          return await action(payload2);
        }
        let jsonPayload;
        if (contentType?.includes("application/json")) jsonPayload = await request.json();
        const payload = jsonPayload ? parsePayload(jsonPayload) : {};
        payload.context = safeObjectMerge(payload.context, context);
        payload.method = methodUpper;
        return await action(payload);
      })();
      const unwrapped = res.result || res.error;
      if (isNotFound(res)) res = isNotFoundResponse(res);
      if (!isServerFn) return unwrapped;
      if (unwrapped instanceof Response) {
        if (isRedirect(unwrapped)) return unwrapped;
        unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
        return unwrapped;
      }
      return serializeResult(res);
    } catch (error) {
      if (error instanceof Response) return error;
      if (isNotFound(error)) return isNotFoundResponse(error);
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      const serializedError = JSON.stringify(await Promise.resolve(toCrossJSONAsync(error, {
        refs: /* @__PURE__ */ new Map(),
        plugins: serovalPlugins
      })));
      const response = getResponse();
      return new Response(serializedError, {
        status: response.status ?? 500,
        statusText: response.statusText,
        headers: {
          "Content-Type": "application/json",
          [X_TSS_SERIALIZED]: "true"
        }
      });
    }
  })();
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
function normalizeTransformAssetResult(result) {
  if (typeof result === "string") return { href: result };
  return result;
}
function resolveTransformAssetsCrossOrigin(config, kind) {
  if (!config) return void 0;
  if (typeof config === "string") return config;
  return config[kind];
}
function isObjectShorthand(transform) {
  return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
  if (typeof transform === "string") {
    const prefix = transform;
    return {
      type: "transform",
      transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
      cache: true
    };
  }
  if (typeof transform === "function") return {
    type: "transform",
    transformFn: transform,
    cache: true
  };
  if (isObjectShorthand(transform)) {
    const { prefix, crossOrigin } = transform;
    return {
      type: "transform",
      transformFn: ({ url, kind }) => {
        const href = `${prefix}${url}`;
        if (kind === "clientEntry") return { href };
        const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
        return co ? {
          href,
          crossOrigin: co
        } : { href };
      },
      cache: true
    };
  }
  if ("createTransform" in transform && transform.createTransform) return {
    type: "createTransform",
    createTransform: transform.createTransform,
    cache: transform.cache !== false
  };
  return {
    type: "transform",
    transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
    cache: transform.cache !== false
  };
}
function adaptTransformAssetUrlsToTransformAssets(transformFn) {
  return async ({ url, kind }) => ({ href: await transformFn({
    url,
    type: kind
  }) });
}
function adaptTransformAssetUrlsConfigToTransformAssets(transform) {
  if (typeof transform === "string") return transform;
  if (typeof transform === "function") return adaptTransformAssetUrlsToTransformAssets(transform);
  if ("createTransform" in transform && transform.createTransform) return {
    createTransform: async (ctx) => adaptTransformAssetUrlsToTransformAssets(await transform.createTransform(ctx)),
    cache: transform.cache,
    warmup: transform.warmup
  };
  return {
    transform: typeof transform.transform === "string" ? transform.transform : adaptTransformAssetUrlsToTransformAssets(transform.transform),
    cache: transform.cache,
    warmup: transform.warmup
  };
}
function buildClientEntryScriptTag(clientEntry, injectedHeadScripts) {
  let script = `import(${JSON.stringify(clientEntry)})`;
  if (injectedHeadScripts) script = `${injectedHeadScripts};${script}`;
  return {
    tag: "script",
    attrs: {
      type: "module",
      async: true
    },
    children: script
  };
}
function assignManifestAssetLink(link, next) {
  if (typeof link === "string") return next.crossOrigin ? next : next.href;
  return next.crossOrigin ? next : { href: next.href };
}
async function transformManifestAssets(source, transformFn, _opts) {
  const manifest2 = structuredClone(source.manifest);
  for (const route of Object.values(manifest2.routes)) {
    if (route.preloads) route.preloads = await Promise.all(route.preloads.map(async (link) => {
      const result = normalizeTransformAssetResult(await transformFn({
        url: resolveManifestAssetLink(link).href,
        kind: "modulepreload"
      }));
      return assignManifestAssetLink(link, {
        href: result.href,
        crossOrigin: result.crossOrigin
      });
    }));
    if (route.assets && !source.manifest.inlineCss) {
      for (const asset of route.assets) if (asset.tag === "link" && asset.attrs?.href) {
        const rel = asset.attrs.rel;
        if (!(typeof rel === "string" ? rel.split(/\s+/) : []).includes("stylesheet")) continue;
        const result = normalizeTransformAssetResult(await transformFn({
          url: asset.attrs.href,
          kind: "stylesheet"
        }));
        asset.attrs.href = result.href;
        if (result.crossOrigin) asset.attrs.crossOrigin = result.crossOrigin;
        else delete asset.attrs.crossOrigin;
      }
    }
  }
  const transformedClientEntry = normalizeTransformAssetResult(await transformFn({
    url: source.clientEntry,
    kind: "clientEntry"
  }));
  const rootRoute = manifest2.routes[rootRouteId] = manifest2.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  rootRoute.assets.push(buildClientEntryScriptTag(transformedClientEntry.href, source.injectedHeadScripts));
  return manifest2;
}
function buildManifestWithClientEntry(source) {
  const scriptTag = buildClientEntryScriptTag(source.clientEntry, source.injectedHeadScripts);
  const baseRootRoute = source.manifest.routes[rootRouteId];
  const routes = {
    ...source.manifest.routes,
    [rootRouteId]: {
      ...baseRootRoute,
      assets: [...baseRootRoute?.assets || [], scriptTag]
    }
  };
  return {
    inlineCss: source.manifest.inlineCss,
    routes
  };
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v) => {
    if (typeof v !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v)) return false;
    return !!v[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
  fromSerializable: ({ functionId }) => {
    const fn = async (opts, signal) => {
      return (await (await getServerFnById(functionId))(opts ?? {}, signal)).result;
    };
    return fn;
  }
});
function getStartResponseHeaders(opts) {
  return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ...opts.router.stores.matches.get().map((match) => {
    return match.headers;
  }));
}
var entriesPromise;
var baseManifestPromise;
var cachedFinalManifestPromise;
async function loadEntries() {
  const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
    import("./router-DmbxdYlk.js"),
    import("./start-DzImHEUK.js"),
    import("./__23tanstack-start-plugin-adapters-Cwee5PKy.js")
  ]);
  return {
    routerEntry,
    startEntry,
    pluginAdapters
  };
}
function getEntries() {
  if (!entriesPromise) entriesPromise = loadEntries();
  return entriesPromise;
}
function getBaseManifest(matchedRoutes) {
  if (!baseManifestPromise) baseManifestPromise = getStartManifest();
  return baseManifestPromise;
}
async function resolveManifest(matchedRoutes, transformFn, cache) {
  const base = await getBaseManifest();
  const computeFinalManifest = async () => {
    return transformFn ? await transformManifestAssets(base, transformFn) : buildManifestWithClientEntry(base);
  };
  if (!transformFn || cache) {
    if (!cachedFinalManifestPromise) cachedFinalManifestPromise = computeFinalManifest();
    return cachedFinalManifestPromise;
  }
  return computeFinalManifest();
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var ERR_NO_RESPONSE = "Internal Server Error";
var ERR_NO_DEFER = "Internal Server Error";
function throwRouteHandlerError() {
  throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
  throw new Error(ERR_NO_DEFER);
}
function isSpecialResponse(value) {
  return value instanceof Response || isRedirect(value);
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) return { response: result };
  return result;
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (nextCtx) => {
    if (nextCtx) {
      if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
      for (const key of Object.keys(nextCtx)) if (key !== "context") ctx[key] = nextCtx[key];
    }
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx;
    let result;
    try {
      result = await middleware({
        ...ctx,
        next
      });
    } catch (err) {
      if (isSpecialResponse(err)) {
        ctx.response = err;
        return ctx;
      }
      throw err;
    }
    const normalized = handleCtxResult(result);
    if (normalized) {
      if (normalized.response !== void 0) ctx.response = normalized.response;
      if (normalized.context) ctx.context = safeObjectMerge(ctx.context, normalized.context);
    }
    return ctx;
  };
  return next();
}
function handlerToMiddleware(handler, mayDefer = false) {
  if (mayDefer) return handler;
  return async (ctx) => {
    const response = await handler({
      ...ctx,
      next: throwIfMayNotDefer
    });
    if (!response) throwRouteHandlerError();
    return response;
  };
}
function createStartHandler(cbOrOptions) {
  const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
  const transformAssetsOption = typeof cbOrOptions === "function" ? void 0 : cbOrOptions.transformAssets;
  const transformAssetUrlsOption = typeof cbOrOptions === "function" ? void 0 : cbOrOptions.transformAssetUrls;
  const transformOption = transformAssetsOption !== void 0 ? resolveTransformAssetsConfig(transformAssetsOption) : transformAssetUrlsOption !== void 0 ? resolveTransformAssetsConfig(adaptTransformAssetUrlsConfigToTransformAssets(transformAssetUrlsOption)) : void 0;
  const warmupTransformManifest = !!transformAssetsOption && typeof transformAssetsOption === "object" && "warmup" in transformAssetsOption && transformAssetsOption.warmup === true || !!transformAssetUrlsOption && typeof transformAssetUrlsOption === "object" && transformAssetUrlsOption.warmup === true;
  const resolvedTransformConfig = transformOption;
  const cache = resolvedTransformConfig ? resolvedTransformConfig.cache : true;
  const shouldCacheCreateTransform = cache && true;
  let cachedCreateTransformPromise;
  const getTransformFn = async (opts) => {
    if (!resolvedTransformConfig) return void 0;
    if (resolvedTransformConfig.type === "createTransform") {
      if (shouldCacheCreateTransform) {
        if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(resolvedTransformConfig.createTransform(opts)).catch((error) => {
          cachedCreateTransformPromise = void 0;
          throw error;
        });
        return cachedCreateTransformPromise;
      }
      return resolvedTransformConfig.createTransform(opts);
    }
    return resolvedTransformConfig.transformFn;
  };
  if (warmupTransformManifest && cache && true && !cachedFinalManifestPromise) {
    const warmupPromise = (async () => {
      const base = await getBaseManifest();
      const transformFn = await getTransformFn({ warmup: true });
      return transformFn ? await transformManifestAssets(base, transformFn) : buildManifestWithClientEntry(base);
    })();
    cachedFinalManifestPromise = warmupPromise;
    warmupPromise.catch(() => {
      if (cachedFinalManifestPromise === warmupPromise) cachedFinalManifestPromise = void 0;
      cachedCreateTransformPromise = void 0;
    });
  }
  const startRequestResolver = async (request, requestOpts) => {
    let router = null;
    let cbWillCleanup = false;
    try {
      const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
      const href = url.pathname + url.search + url.hash;
      const origin = getOrigin(request);
      if (handledProtocolRelativeURL) return Response.redirect(url, 308);
      const entries = await getEntries();
      const startOptions = await entries.startEntry.startInstance?.getOptions() || {};
      const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
      const serializationAdapters = [
        ...startOptions.serializationAdapters || [],
        ...hasPluginAdapters ? pluginSerializationAdapters : [],
        ServerFunctionSerializationAdapter
      ];
      const requestStartOptions = {
        ...startOptions,
        serializationAdapters
      };
      const flattenedRequestMiddlewares = startOptions.requestMiddleware ? flattenMiddlewares(startOptions.requestMiddleware) : [];
      const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
      const getRouter = async () => {
        if (router) return router;
        router = await entries.routerEntry.getRouter();
        let isShell = IS_SHELL_ENV;
        if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
        const history = createMemoryHistory({ initialEntries: [href] });
        router.update({
          history,
          isShell,
          isPrerendering: IS_PRERENDERING,
          origin: router.options.origin ?? origin,
          defaultSsr: requestStartOptions.defaultSsr,
          serializationAdapters: [...requestStartOptions.serializationAdapters, ...router.options.serializationAdapters || []],
          basepath: ROUTER_BASEPATH
        });
        return router;
      };
      if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
        const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
        if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
        const serverFnHandler = async ({ context }) => {
          return runWithStartContext({
            getRouter,
            startOptions: requestStartOptions,
            contextAfterGlobalMiddlewares: context,
            request,
            executedRequestMiddlewares,
            handlerType: "serverFn"
          }, () => handleServerAction({
            request,
            context: requestOpts?.context,
            serverFnId
          }));
        };
        return handleRedirectResponse((await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), serverFnHandler], {
          request,
          pathname: url.pathname,
          context: createNullProtoObject(requestOpts?.context)
        })).response, request, getRouter);
      }
      const executeRouter = async (serverContext, matchedRoutes) => {
        const acceptParts = (request.headers.get("Accept") || "*/*").split(",");
        if (!["*/*", "text/html"].some((mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType)))) return Response.json({ error: "Only HTML requests are supported here" }, { status: 500 });
        const manifest2 = await resolveManifest(matchedRoutes, await getTransformFn({
          warmup: false,
          request
        }), cache);
        const routerInstance = await getRouter();
        attachRouterServerSsrUtils({
          router: routerInstance,
          manifest: manifest2,
          getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets,
          includeUnmatchedRouteAssets: false
        });
        routerInstance.update({ additionalContext: { serverContext } });
        await routerInstance.load();
        if (routerInstance.state.redirect) return routerInstance.state.redirect;
        const ctx = getStartContext({ throwIfNotFound: false });
        await routerInstance.serverSsr.dehydrate({ requestAssets: ctx?.requestAssets });
        const responseHeaders = getStartResponseHeaders({ router: routerInstance });
        cbWillCleanup = true;
        return cb({
          request,
          router: routerInstance,
          responseHeaders
        });
      };
      const requestHandlerMiddleware = async ({ context }) => {
        return runWithStartContext({
          getRouter,
          startOptions: requestStartOptions,
          contextAfterGlobalMiddlewares: context,
          request,
          executedRequestMiddlewares,
          handlerType: "router"
        }, async () => {
          try {
            return await handleServerRoutes({
              getRouter,
              request,
              url,
              executeRouter,
              context,
              executedRequestMiddlewares
            });
          } catch (err) {
            if (err instanceof Response) return err;
            throw err;
          }
        });
      };
      return handleRedirectResponse((await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), requestHandlerMiddleware], {
        request,
        pathname: url.pathname,
        context: createNullProtoObject(requestOpts?.context)
      })).response, request, getRouter);
    } finally {
      if (router && !cbWillCleanup) router.serverSsr?.cleanup();
      router = null;
    }
  };
  return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
  if (!isRedirect(response)) return response;
  if (isResolvedRedirect(response)) {
    if (request.headers.get("x-tsr-serverFn") === "true") return Response.json({
      ...response.options,
      isSerializedRedirect: true
    }, { headers: response.headers });
    return response;
  }
  const opts = response.options;
  if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
  if ([
    "params",
    "search",
    "hash"
  ].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
  const redirect = (await getRouter()).resolveRedirect(response);
  if (request.headers.get("x-tsr-serverFn") === "true") return Response.json({
    ...response.options,
    isSerializedRedirect: true
  }, { headers: response.headers });
  return redirect;
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
  const router = await getRouter();
  const pathname = executeRewriteInput(router.rewrite, url).pathname;
  const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
  const isExactMatch = foundRoute && routeParams["**"] === void 0;
  const routeMiddlewares = [];
  for (const route of matchedRoutes) {
    const serverMiddleware = route.options.server?.middleware;
    if (serverMiddleware) {
      const flattened = flattenMiddlewares(serverMiddleware);
      for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
    }
  }
  const server2 = foundRoute?.options.server;
  if (server2?.handlers && isExactMatch) {
    const handlers = typeof server2.handlers === "function" ? server2.handlers({ createHandlers: (d) => d }) : server2.handlers;
    const handler = handlers[request.method.toUpperCase()] ?? handlers["ANY"];
    if (handler) {
      const mayDefer = !!foundRoute.options.component;
      if (typeof handler === "function") routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
      else {
        if (handler.middleware?.length) {
          const handlerMiddlewares = flattenMiddlewares(handler.middleware);
          for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
        }
        if (handler.handler) routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
      }
    }
  }
  routeMiddlewares.push((ctx) => executeRouter(ctx.context, matchedRoutes));
  return (await executeMiddleware(routeMiddlewares, {
    request,
    context,
    params: routeParams,
    pathname
  })).response;
}
var fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
  return { async fetch(...args) {
    return await entry.fetch(...args);
  } };
}
var server_default = createServerEntry({ fetch });
const server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createServerEntry,
  default: server_default
}, Symbol.toStringTag, { value: "Module" }));
export {
  TSS_SERVER_FUNCTION as T,
  getRequest as a,
  createServerFn as c,
  getServerFnById as g,
  server as s
};

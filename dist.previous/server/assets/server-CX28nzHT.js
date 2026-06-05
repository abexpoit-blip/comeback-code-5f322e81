let serverEntryPromise;
async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("./server-BTtYLKd6.js").then((n) => n.s).then(
      (m) => m.default ?? m
    );
  }
  return serverEntryPromise;
}
function applySecurityHeaders(request, response) {
  const url = new URL(request.url);
  const headers = new Headers(response.headers);
  if (!headers.has("strict-transport-security")) {
    headers.set("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
  }
  if (!headers.has("x-content-type-options")) {
    headers.set("x-content-type-options", "nosniff");
  }
  if (!headers.has("referrer-policy")) {
    headers.set("referrer-policy", "strict-origin-when-cross-origin");
  }
  if (!headers.has("permissions-policy")) {
    headers.set("permissions-policy", "geolocation=(), microphone=(), camera=(), payment=()");
  }
  if (!headers.has("x-xss-protection")) {
    headers.set("x-xss-protection", "0");
  }
  const isRedirectRoute = url.pathname.startsWith("/r/");
  if (!isRedirectRoute && !headers.has("x-frame-options")) {
    headers.set("x-frame-options", "SAMEORIGIN");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
const server = {
  async fetch(request, env, ctx) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(request, response);
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        request,
        new Response("Internal Server Error", {
          status: 500,
          headers: { "content-type": "text/plain; charset=utf-8" }
        })
      );
    }
  }
};
export {
  server as default
};

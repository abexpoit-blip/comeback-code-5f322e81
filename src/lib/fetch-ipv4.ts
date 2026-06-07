// Force outbound HTTP requests over IPv4. The VPS has IPv6 enabled and Node's
// global fetch may prefer IPv6, causing third-party APIs (e.g. Plisio) to see
// the IPv6 address instead of the whitelisted IPv4.
//
// IMPORTANT: undici is a Node-only module. We must NOT import it at module
// top-level because this file is reachable from `.functions.ts` files whose
// top-level imports also end up in the client bundle. We lazy-load undici
// inside the function so the browser never tries to evaluate it.

let _agent: any = null;
let _undiciFetch: any = null;

async function getUndici() {
  if (_undiciFetch && _agent) return { fetch: _undiciFetch, agent: _agent };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const undici = await import("undici");
  _agent = new undici.Agent({ connect: { family: 4 } });
  _undiciFetch = undici.fetch;
  return { fetch: _undiciFetch, agent: _agent };
}

export const fetchIpv4: typeof fetch = (async (input: any, init: any = {}) => {
  // Only use undici on the server. In the (unexpected) case this runs in a
  // browser bundle, fall back to the global fetch.
  if (typeof window !== "undefined") return fetch(input, init);
  const { fetch: uf, agent } = await getUndici();
  return uf(input, { ...init, dispatcher: agent }) as unknown as Response;
}) as unknown as typeof fetch;

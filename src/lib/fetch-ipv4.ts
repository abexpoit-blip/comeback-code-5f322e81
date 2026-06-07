// Force outbound HTTP requests over IPv4. The VPS has IPv6 enabled and Node's
// global fetch may prefer IPv6, causing third-party APIs (e.g. Plisio) to see
// the IPv6 address instead of the whitelisted IPv4. We use undici with an
// Agent that pins the address family to 4.
import { Agent, fetch as undiciFetch } from "undici";

let ipv4Agent: Agent | null = null;
function getAgent() {
  if (!ipv4Agent) {
    ipv4Agent = new Agent({ connect: { family: 4 } });
  }
  return ipv4Agent;
}

export const fetchIpv4: typeof fetch = ((input: any, init: any = {}) => {
  return undiciFetch(input, { ...init, dispatcher: getAgent() }) as unknown as Promise<Response>;
}) as typeof fetch;

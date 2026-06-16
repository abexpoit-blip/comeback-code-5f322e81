// Redis L2 cache (shared across all 8 PM2 workers).
// Best-effort: every operation swallows errors so the redirect path
// never fails because of Redis. L1 in-memory cache stays as the
// short-lived hot path; Redis is the cross-worker source of truth.

import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

let client: Redis | null = null;
let disabled = false;
let lastErrLog = 0;

function logErr(label: string, err: unknown) {
  const now = Date.now();
  if (now - lastErrLog < 30_000) return; // throttle
  lastErrLog = now;
  console.warn(`[redis-cache][${label}]`, (err as Error)?.message || err);
}

function getClient(): Redis | null {
  if (disabled) return null;
  if (client) return client;
  try {
    client = new Redis(REDIS_URL, {
      lazyConnect: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 500,
      enableOfflineQueue: false,
      enableAutoPipelining: true,
      retryStrategy: (times) => (times > 10 ? null : Math.min(times * 200, 3000)),
    });
    client.on("error", (err) => logErr("conn", err));
    // L6 FIX: when retryStrategy returns null (>10 failed attempts), ioredis
    // emits "end" and the socket stays dead. Flip the fast-exit flag so
    // getClient() stops returning a permanently-broken client.
    client.on("end", () => {
      disabled = true;
      client = null;
    });
    return client;
  } catch (err) {
    logErr("init", err);
    disabled = true;
    return null;
  }
}

// Eagerly init on first import so the connection is warm.
getClient();

export async function redisGet<T = unknown>(key: string): Promise<T | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const raw = await c.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    logErr("get", err);
    return null;
  }
}

export async function redisSet(key: string, value: unknown, ttlMs: number): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    // PX = TTL in milliseconds
    await c.set(key, JSON.stringify(value), "PX", Math.max(1000, ttlMs));
  } catch (err) {
    logErr("set", err);
  }
}

export async function redisDel(...keys: string[]): Promise<void> {
  const c = getClient();
  if (!c || keys.length === 0) return;
  try {
    await c.del(...keys);
  } catch (err) {
    logErr("del", err);
  }
}

// Fire-and-forget set — caller does not await, errors logged internally.
export function redisSetAsync(key: string, value: unknown, ttlMs: number): void {
  void redisSet(key, value, ttlMs);
}

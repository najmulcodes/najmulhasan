/**
 * Optional fixed-window limiter on Upstash Redis REST (no SDK needed).
 * Without Upstash env it allows everything: in-memory counters are useless on serverless,
 * so the password length is the real protection and Upstash is the belt-and-braces layer.
 */
export async function allow(key: string, max: number, windowSec: number): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return true;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, windowSec, "NX"]]),
      cache: "no-store",
    });
    const data = (await res.json()) as { result?: unknown }[];
    const count = data?.[0]?.result;
    return typeof count === "number" ? count <= max : true;
  } catch (err) {
    console.error("[admin] rate limiter unavailable", err);
    return true; // fail open: don't lock the owner out
  }
}

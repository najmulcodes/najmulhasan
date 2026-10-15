import { indexnowKey } from "@/lib/admin/config";

export const dynamic = "force-dynamic";

// IndexNow ownership proof: https://<site>/indexnow-key.txt must return the key.
export function GET() {
  const key = indexnowKey();
  return key
    ? new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
    : new Response("Not found", { status: 404 });
}

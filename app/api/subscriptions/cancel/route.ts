import { proxyToBackend } from "@/lib/api-proxy";

export async function POST() {
  return proxyToBackend("/api/subscriptions/cancel/", { method: "POST" });
}

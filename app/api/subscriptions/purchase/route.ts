import { NextRequest } from "next/server";
import { proxyToBackend, readJsonBody } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  return proxyToBackend("/api/subscriptions/purchase/", { method: "POST", body });
}

import { NextRequest } from "next/server";
import { proxyToBackend, readJsonBody } from "@/lib/api-proxy";

export async function PATCH(request: NextRequest) {
  const body = await readJsonBody(request);
  return proxyToBackend("/api/auth/profile/", { method: "PATCH", body });
}

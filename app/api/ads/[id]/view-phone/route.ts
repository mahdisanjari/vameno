import { proxyToBackend } from "@/lib/api-proxy";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  return proxyToBackend(`/api/ads/${params.id}/view-phone/`, { method: "POST" });
}

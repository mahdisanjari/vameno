import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";
import { buildAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const res = await fetch(`${API_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const { access, refresh, ...rest } = data;
  const response = NextResponse.json({ user: rest.user ?? rest }, { status: 201 });

  if (access && refresh) {
    for (const c of buildAuthCookies({ access, refresh })) {
      response.cookies.set(c.name, c.value, c.options);
    }
  }

  return response;
}

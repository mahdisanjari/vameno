import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";
import { buildAuthCookies, buildClearAuthCookies, getRefreshTokenFromCookies } from "@/lib/auth";

export async function POST() {
  const refreshToken = getRefreshTokenFromCookies();

  if (!refreshToken) {
    return NextResponse.json({ detail: "no refresh token" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    const response = NextResponse.json({ detail: "refresh failed" }, { status: 401 });
    for (const c of buildClearAuthCookies()) {
      response.cookies.set(c.name, c.value, c.options);
    }
    return response;
  }

  const data = await res.json();
  const response = NextResponse.json({ ok: true });
  for (const c of buildAuthCookies({ access: data.access, refresh: data.refresh ?? refreshToken })) {
    response.cookies.set(c.name, c.value, c.options);
  }
  return response;
}

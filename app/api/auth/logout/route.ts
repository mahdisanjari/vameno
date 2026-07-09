import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";
import { buildClearAuthCookies, getRefreshTokenFromCookies } from "@/lib/auth";

export async function POST() {
  const refreshToken = getRefreshTokenFromCookies();

  if (refreshToken) {
    try {
      await fetch(`${API_URL}/api/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
        cache: "no-store",
      });
    } catch {
      // best-effort — clear local cookies regardless of backend result
    }
  }

  const response = NextResponse.json({ ok: true });
  for (const c of buildClearAuthCookies()) {
    response.cookies.set(c.name, c.value, c.options);
  }
  return response;
}

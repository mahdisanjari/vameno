import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "./constants";
import { buildAuthCookies, buildClearAuthCookies, getAccessTokenFromCookies, getRefreshTokenFromCookies } from "./auth";
import type { AuthTokens } from "./types";

async function refreshAccessToken(refreshToken: string): Promise<AuthTokens | null> {
  const res = await fetch(`${API_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.access) return null;
  return { access: data.access, refresh: data.refresh ?? refreshToken };
}

interface ProxyOptions {
  method?: string;
  body?: unknown;
  requireAuth?: boolean;
}

/**
 * Forwards a request from a Next.js Route Handler to the Django backend,
 * attaching the httpOnly access token and transparently refreshing it once
 * on a 401 before retrying. Keeps tokens server-side only.
 */
export async function proxyToBackend(path: string, { method = "GET", body, requireAuth = true }: ProxyOptions = {}) {
  let accessToken = getAccessTokenFromCookies();
  const refreshToken = getRefreshTokenFromCookies();

  if (requireAuth && !accessToken && !refreshToken) {
    return NextResponse.json({ detail: "authentication required" }, { status: 401 });
  }

  const doRequest = (token?: string) =>
    fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

  let res = await doRequest(accessToken);
  let refreshedTokens: AuthTokens | null = null;

  if (res.status === 401 && refreshToken) {
    refreshedTokens = await refreshAccessToken(refreshToken);
    if (refreshedTokens) {
      accessToken = refreshedTokens.access;
      res = await doRequest(accessToken);
    }
  }

  const responseBody = await res.text();
  const nextRes = new NextResponse(responseBody, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });

  if (refreshedTokens) {
    for (const c of buildAuthCookies(refreshedTokens)) {
      nextRes.cookies.set(c.name, c.value, c.options);
    }
  } else if (res.status === 401 && refreshToken) {
    for (const c of buildClearAuthCookies()) {
      nextRes.cookies.set(c.name, c.value, c.options);
    }
  }

  return nextRes;
}

export async function readJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

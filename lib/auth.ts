import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SITE_URL } from "./constants";
import type { AuthTokens } from "./types";

/** Trust a TLS-terminating proxy's header first; fall back to the request's own protocol. */
export function isHttpsRequest(request: NextRequest): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) return (forwardedProto.split(",")[0] ?? "").trim() === "https";
  return request.nextUrl.protocol === "https:";
}

// `Secure` cookies are silently dropped by the browser when the site itself is
// served over plain HTTP. Callers that have access to the incoming NextRequest
// should pass its actual protocol in — that's authoritative. This env-based
// value is only a fallback for call sites that don't have the request handy.
const ENV_IS_HTTPS = SITE_URL.startsWith("https://");

function cookieOptions(secure: boolean = ENV_IS_HTTPS) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
  };
}

export function getAccessTokenFromCookies(): string | undefined {
  return cookies().get(ACCESS_TOKEN_COOKIE)?.value;
}

export function getRefreshTokenFromCookies(): string | undefined {
  return cookies().get(REFRESH_TOKEN_COOKIE)?.value;
}

export function authHeaderFromCookies(): Record<string, string> {
  const token = getAccessTokenFromCookies();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function buildAuthCookies(tokens: AuthTokens, secure?: boolean) {
  const options = cookieOptions(secure);
  return [
    {
      name: ACCESS_TOKEN_COOKIE,
      value: tokens.access,
      options: { ...options, maxAge: 60 * 15 },
    },
    {
      name: REFRESH_TOKEN_COOKIE,
      value: tokens.refresh,
      options: { ...options, maxAge: 60 * 60 * 24 * 30 },
    },
  ];
}

export function buildClearAuthCookies(secure?: boolean) {
  const options = cookieOptions(secure);
  return [
    { name: ACCESS_TOKEN_COOKIE, value: "", options: { ...options, maxAge: 0 } },
    { name: REFRESH_TOKEN_COOKIE, value: "", options: { ...options, maxAge: 0 } },
  ];
}

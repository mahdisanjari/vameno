import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SITE_URL } from "./constants";
import type { AuthTokens } from "./types";

// `Secure` cookies are silently dropped by the browser when the site itself is
// served over plain HTTP, so tie this to the deployment's actual protocol
// (SITE_URL) rather than NODE_ENV — a production deploy isn't necessarily HTTPS.
const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: SITE_URL.startsWith("https://"),
  sameSite: "lax" as const,
  path: "/",
};

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

export function buildAuthCookies(tokens: AuthTokens) {
  return [
    {
      name: ACCESS_TOKEN_COOKIE,
      value: tokens.access,
      options: { ...COOKIE_BASE_OPTIONS, maxAge: 60 * 15 },
    },
    {
      name: REFRESH_TOKEN_COOKIE,
      value: tokens.refresh,
      options: { ...COOKIE_BASE_OPTIONS, maxAge: 60 * 60 * 24 * 30 },
    },
  ];
}

export function buildClearAuthCookies() {
  return [
    { name: ACCESS_TOKEN_COOKIE, value: "", options: { ...COOKIE_BASE_OPTIONS, maxAge: 0 } },
    { name: REFRESH_TOKEN_COOKIE, value: "", options: { ...COOKIE_BASE_OPTIONS, maxAge: 0 } },
  ];
}

import { API_URL } from "./constants";
import { authHeaderFromCookies } from "./auth";

export class ApiRequestError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

interface ServerFetchOptions {
  revalidate?: number | false;
  tags?: string[];
  withAuth?: boolean;
  cache?: RequestCache;
}

/**
 * Fetch helper for Server Components / route handlers doing read-only
 * calls to the Django API. Not for authenticated mutations from the
 * client — those go through Next.js route handlers (see lib/api-proxy.ts)
 * so the httpOnly token never reaches client JS.
 */
export async function serverFetch<T>(
  path: string,
  { revalidate = 300, tags, withAuth = false, cache }: ServerFetchOptions = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(withAuth ? authHeaderFromCookies() : {}),
    },
    ...(cache ? { cache } : { next: { revalidate: revalidate === false ? undefined : revalidate, tags } }),
  });

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* no json body */
    }
    console.error(`[serverFetch] ${res.status} ${url}`, body ?? "");
    throw new ApiRequestError(`API request failed: ${res.status} ${url}`, res.status, body);
  }

  return res.json() as Promise<T>;
}

/** Like serverFetch but returns null on 404 instead of throwing, handy for notFound() flows. */
export async function serverFetchOrNull<T>(path: string, options: ServerFetchOptions = {}): Promise<T | null> {
  try {
    return await serverFetch<T>(path, options);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) return null;
    throw err;
  }
}

interface DrfPage<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Some list endpoints (banks, loans) are paginated by DRF even though we
 * usually want the full set (e.g. to populate a <select>). Follows `next`
 * until exhausted, capped to avoid runaway loops on a misbehaving API.
 */
export async function serverFetchAllPages<T>(path: string, options: ServerFetchOptions = {}): Promise<T[]> {
  const all: T[] = [];
  let next: string | null = path;
  let guard = 0;

  while (next && guard < 25) {
    const page: DrfPage<T> = await serverFetch<DrfPage<T>>(next, options);
    all.push(...page.results);
    next = page.next;
    guard += 1;
  }

  return all;
}

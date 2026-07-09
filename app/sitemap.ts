import type { MetadataRoute } from "next";
import { serverFetch, serverFetchAllPages } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import type { Ad, Bank, City, Loan, PaginatedResponse } from "@/lib/types";

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    return await serverFetch<T>(path, { revalidate: 3600 });
  } catch {
    return fallback;
  }
}

async function safeFetchAllPages<T>(path: string): Promise<T[]> {
  try {
    return await serverFetchAllPages<T>(path, { revalidate: 3600 });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, banks, loans, ads] = await Promise.all([
    safeFetch<City[]>("/api/locations/cities/", []),
    safeFetchAllPages<Bank>("/api/banks/"),
    safeFetchAllPages<Loan>("/api/banks/loans/"),
    safeFetch<PaginatedResponse<Ad>>("/api/ads/", { count: 0, next: null, previous: null, results: [] }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/subscription`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = cities.flatMap((city) => [
    { url: `${SITE_URL}/buy/${city.slug}`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${SITE_URL}/sell/${city.slug}`, changeFrequency: "daily" as const, priority: 0.9 },
  ]);

  const bankRoutes: MetadataRoute.Sitemap = banks.map((bank) => ({
    url: `${SITE_URL}/banks/${bank.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const loanRoutes: MetadataRoute.Sitemap = loans.map((loan) => ({
    url: `${SITE_URL}/loan/${loan.bank.slug}/${loan.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const adRoutes: MetadataRoute.Sitemap = ads.results
    .filter((ad) => ad.status !== "expired" && !ad.is_expired)
    .map((ad) => ({
      url: `${SITE_URL}/ads/${ad.id}`,
      changeFrequency: "daily" as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...cityRoutes, ...bankRoutes, ...loanRoutes, ...adRoutes];
}

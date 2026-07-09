import { serverFetchOrNull, serverFetch, serverFetchAllPages } from "./api";
import type { Ad, Bank, CityPage, CityPageType, Loan, PaginatedResponse } from "./types";

export type AdOrdering = "-created_at" | "created_at" | "-amount" | "amount" | "-views_count" | "views_count";

export interface CitySearchParams {
  bank?: string;
  loan_type?: string;
  min_amount?: string;
  max_amount?: string;
  search?: string;
  ordering?: AdOrdering;
  page?: string;
}

export async function getCityPage(citySlug: string, pageType: CityPageType) {
  return serverFetchOrNull<CityPage>(
    `/api/locations/pages/${encodeURIComponent(citySlug)}/?page_type=${pageType}`,
    { revalidate: 300 },
  );
}

export function buildAdsQuery(citySlug: string, pageType: CityPageType, searchParams: CitySearchParams) {
  const params = new URLSearchParams();
  params.set("city", citySlug);
  params.set("ad_type", pageType);
  if (searchParams.bank) params.set("bank", searchParams.bank);
  if (searchParams.loan_type) params.set("loan_type", searchParams.loan_type);
  if (searchParams.min_amount) params.set("min_amount", searchParams.min_amount);
  if (searchParams.max_amount) params.set("max_amount", searchParams.max_amount);
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.ordering) params.set("ordering", searchParams.ordering);
  if (searchParams.page) params.set("page", searchParams.page);
  return params.toString();
}

export async function getCityAds(citySlug: string, pageType: CityPageType, searchParams: CitySearchParams) {
  const query = buildAdsQuery(citySlug, pageType, searchParams);
  try {
    return await serverFetch<PaginatedResponse<Ad>>(`/api/ads/?${query}`, { revalidate: 60 });
  } catch {
    return { count: 0, next: null, previous: null, results: [] } satisfies PaginatedResponse<Ad>;
  }
}

export async function getBanksAndLoans() {
  try {
    const [banks, loans] = await Promise.all([
      serverFetchAllPages<Bank>("/api/banks/", { revalidate: 600 }),
      serverFetchAllPages<Loan>("/api/banks/loans/", { revalidate: 600 }),
    ]);
    return { banks, loans };
  } catch {
    return { banks: [] as Bank[], loans: [] as Loan[] };
  }
}

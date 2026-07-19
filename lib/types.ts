export interface User {
  id: string;
  phone_number: string;
  full_name: string;
  subscription_expires_at?: string | null;
  free_views_count: number;
  has_active_subscription: boolean | string;
  created_at: string;
}

/** Loan shape as nested inside a Bank (from /api/banks/) — no back-reference to its bank. */
export interface BankLoanSummary {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  featured_image?: string | null;
  min_amount?: number | null;
  max_amount?: number | null;
  interest_rate?: string | null;
  max_duration_months?: number | null;
  is_featured?: boolean;
  created_at?: string;
}

export interface Bank {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string;
  rich_content?: string;
  website?: string;
  loan_count?: number;
  loans?: BankLoanSummary[];
  meta_title?: string;
  meta_description?: string;
  absolute_url?: string;
}

/** GET /api/banks/{slug}/ doesn't return a flat Bank — it wraps it with the bank's loans. */
export interface BankDetailResponse {
  bank: Bank;
  loans: Loan[];
  total_loans: number;
}

export interface Loan {
  id: string;
  name: string;
  slug: string;
  bank: Bank;
  short_description?: string;
  rich_content?: string;
  featured_image?: string | null;
  min_amount?: number | null;
  max_amount?: number | null;
  interest_rate?: string | null;
  max_duration_months?: number | null;
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  absolute_url?: string;
}

export interface Province {
  id: string;
  name: string;
  slug: string;
  code?: string;
  cities_count?: number;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  province_name: string;
  is_capital?: boolean;
  is_featured?: boolean;
}

export type CityPageType = "buy" | "sell";

export interface CityPage {
  id: string;
  city_name: string;
  province_name: string;
  page_type: CityPageType;
  page_type_display: string;
  title: string;
  rich_content?: string;
  featured_image?: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  url: string;
  updated_at: string;
}

export type AdType = "buy" | "sell";

/** Shape returned by list endpoints (/api/ads/, /api/ads/my-ads/) — flat display fields, no phone number. */
export interface Ad {
  id: string;
  title: string;
  description?: string;
  amount: number;
  remaining_amount?: number | null;
  monthly_installment?: number | null;
  remaining_installments?: number | null;
  city_name: string;
  province_name?: string;
  loan_type_name?: string | null;
  bank_name?: string | null;
  bank?: Bank | null;
  ad_type: AdType;
  ad_type_display?: string;
  status?: string;
  status_display?: string;
  views_count?: number;
  is_expired?: boolean;
  url: string;
  created_at: string;
}

/** Shape returned by the single-ad endpoint (/api/ads/{id}/) — nested objects, no phone number. */
export interface AdDetail {
  id: string;
  user_name: string;
  title: string;
  description?: string;
  amount: number;
  remaining_amount?: number | null;
  monthly_installment?: number | null;
  remaining_installments?: number | null;
  city: City;
  loan_type: Loan | null;
  bank: Bank | null;
  ad_type: AdType;
  ad_type_display?: string;
  status?: string;
  status_display?: string;
  views_count?: number;
  phone_views_count?: number;
  is_expired?: boolean;
  url: string;
  created_at: string;
  expires_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  duration_type: "monthly" | "yearly";
  duration_display?: string;
  duration_days: number;
  price: number;
  discounted_price?: string;
  price_per_month?: string;
  discount_percentage?: number;
  savings?: string;
  description?: string;
  is_featured?: boolean;
}

export interface Subscription {
  id: string;
  user_name: string;
  plan: SubscriptionPlan;
  starts_at: string;
  expires_at: string;
  price_paid: number;
  status: string;
  status_display: string;
  is_active: boolean | string;
  days_remaining: number | string;
  auto_renew?: boolean;
  created_at: string;
}

export interface ApiError {
  detail?: string;
  error?: string;
  [key: string]: unknown;
}

export interface ViewPhoneResponse {
  phone_number: string;
  remaining_views: number | null;
  unlimited?: boolean;
  message?: string;
}

export interface ViewPhoneErrorResponse {
  error: "subscription_required" | string;
  detail?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

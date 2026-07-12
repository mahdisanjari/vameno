import { Suspense } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AdFilterSidebar } from "@/components/ads/AdFilterSidebar";
import { AdList } from "@/components/ads/AdList";
import { ReadMoreRichText } from "@/components/ReadMoreRichText";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import type { Ad, Bank, CityPage, CityPageType, Loan, PaginatedResponse } from "@/lib/types";
import type { CitySearchParams } from "@/lib/city-page";

interface CityPageViewProps {
  cityPage: CityPage;
  ads: PaginatedResponse<Ad>;
  banks: Bank[];
  loans: Loan[];
  page: number;
  pageType: CityPageType;
  citySlug: string;
  searchParams: CitySearchParams;
}

export function CityPageView({ cityPage, ads, banks, loans, page, pageType, citySlug, searchParams }: CityPageViewProps) {
  const label = pageType === "buy" ? "خرید وام" : "فروش وام";
  const heading = cityPage.title || `${label} در ${cityPage.city_name}`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: ads.results.map((ad, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/ads/${ad.id}`,
    })),
  };

  return (
    <div className="container-page py-8">
      <JsonLd data={itemListJsonLd} />
      <Breadcrumbs items={[{ label }, { label: cityPage.city_name }]} />

      <h1 className="mb-2 text-2xl font-extrabold text-neutral-900">{heading}</h1>
      <p className="mb-6 text-sm text-neutral-500">
        آگهی‌های {label.toLowerCase()} فعال در شهر {cityPage.city_name} را مشاهده و فیلتر کنید.
      </p>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-neutral-100" />}>
          <AdFilterSidebar banks={banks} loanTypes={loans} />
        </Suspense>
        <AdList
          data={ads}
          currentPage={page}
          buildPageHref={(p) => {
            const params = new URLSearchParams();
            if (searchParams.search) params.set("search", searchParams.search);
            if (searchParams.bank) params.set("bank", searchParams.bank);
            if (searchParams.loan_type) params.set("loan_type", searchParams.loan_type);
            if (searchParams.min_amount) params.set("min_amount", searchParams.min_amount);
            if (searchParams.max_amount) params.set("max_amount", searchParams.max_amount);
            if (searchParams.ordering) params.set("ordering", searchParams.ordering);
            params.set("page", String(p));
            return `/${pageType}/${citySlug}?${params.toString()}`;
          }}
        />
      </div>

      {cityPage.rich_content && (
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <ReadMoreRichText html={cityPage.rich_content} />
        </div>
      )}
    </div>
  );
}

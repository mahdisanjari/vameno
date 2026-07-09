import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPageView } from "@/components/ads/CityPageView";
import { getBanksAndLoans, getCityAds, getCityPage, type CitySearchParams } from "@/lib/city-page";

export const revalidate = 300;

interface PageProps {
  params: { city: string };
  searchParams: CitySearchParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cityPage = await getCityPage(params.city, "buy");
  if (!cityPage) return {};

  return {
    title: cityPage.meta_title || `خرید وام در ${cityPage.city_name}`,
    description:
      cityPage.meta_description ||
      `آگهی‌های خرید وام در شهر ${cityPage.city_name} را در وامنو مشاهده و مقایسه کنید.`,
    alternates: { canonical: `/buy/${params.city}` },
  };
}

export default async function BuyCityPage({ params, searchParams }: PageProps) {
  const cityPage = await getCityPage(params.city, "buy");
  if (!cityPage) notFound();

  const [ads, { banks, loans }] = await Promise.all([
    getCityAds(params.city, "buy", searchParams),
    getBanksAndLoans(),
  ]);

  return (
    <CityPageView
      cityPage={cityPage}
      ads={ads}
      banks={banks}
      loans={loans}
      page={Number(searchParams.page) || 1}
      pageType="buy"
      citySlug={params.city}
      searchParams={searchParams}
    />
  );
}

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
  const cityPage = await getCityPage(params.city, "sell");
  if (!cityPage) return {};

  return {
    title: cityPage.meta_title || `فروش وام در ${cityPage.city_name}`,
    description:
      cityPage.meta_description ||
      `آگهی‌های فروش وام در شهر ${cityPage.city_name} را در وامنو مشاهده و مقایسه کنید.`,
    alternates: { canonical: `/sell/${params.city}` },
  };
}

export default async function SellCityPage({ params, searchParams }: PageProps) {
  const cityPage = await getCityPage(params.city, "sell");
  if (!cityPage) notFound();

  const [ads, { banks, loans }] = await Promise.all([
    getCityAds(params.city, "sell", searchParams),
    getBanksAndLoans(),
  ]);

  return (
    <CityPageView
      cityPage={cityPage}
      ads={ads}
      banks={banks}
      loans={loans}
      page={Number(searchParams.page) || 1}
      pageType="sell"
      citySlug={params.city}
      searchParams={searchParams}
    />
  );
}

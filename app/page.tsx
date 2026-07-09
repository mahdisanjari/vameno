import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ShieldCheck, TrendingUp, Landmark, MapPin, ArrowLeft, Users } from "lucide-react";
import { serverFetch, serverFetchAllPages } from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { AdCard } from "@/components/ads/AdCard";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Ad, Bank, City, PaginatedResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: `${SITE_NAME} | خرید و فروش وام با اعتماد و شفافیت`,
  description:
    "در وامنو، آگهی‌های خرید و فروش وام را بر اساس شهر و بانک مقایسه کنید. ثبت آگهی رایگان و مشاهده شماره تماس آسان.",
  alternates: { canonical: "/" },
};

async function getFeaturedCities() {
  try {
    return await serverFetch<City[]>("/api/locations/cities/?featured=true", { revalidate: 600 });
  } catch {
    return [];
  }
}

async function getBanks() {
  try {
    return await serverFetchAllPages<Bank>("/api/banks/", { revalidate: 600 });
  } catch {
    return [];
  }
}

async function getLatestAds() {
  try {
    return await serverFetch<PaginatedResponse<Ad>>("/api/ads/", { revalidate: 120 });
  } catch {
    return null;
  }
}

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "واسط شفاف و امن",
    desc: "وامنو صرفاً بستر آگهی است و در معاملات مالی طرفین دخالتی ندارد.",
  },
  {
    icon: TrendingUp,
    title: "مقایسه آسان وام‌ها",
    desc: "آگهی‌ها را بر اساس بانک، نوع وام و مبلغ فیلتر و مقایسه کنید.",
  },
  {
    icon: Users,
    title: "پشتیبانی پاسخگو",
    desc: "تیم پشتیبانی وامنو در تمام مراحل همراه شماست.",
  },
];

export default async function HomePage() {
  const [cities, banks, latestAds] = await Promise.all([getFeaturedCities(), getBanks(), getLatestAds()]);
  const primaryCity = cities[0];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };

  return (
    <div>
      <JsonLd data={websiteJsonLd} />

      <section className="border-b border-neutral-200 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
              <ShieldCheck size={14} /> پلتفرم واسط آگهی وام، شفاف و قابل اعتماد
            </span>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl">
              خرید و فروش وام،
              <span className="text-primary-700"> ساده و مطمئن</span>
            </h1>
            <p className="mb-8 max-w-xl text-base leading-8 text-neutral-600">
              وامنو آگهی‌های خرید و فروش وام را از سراسر ایران در یک‌جا گرد آورده تا شما بتوانید
              بر اساس شهر، بانک و نوع وام، بهترین گزینه را پیدا کنید.
            </p>
            <div className="flex flex-wrap gap-3">
              {primaryCity ? (
                <>
                  <Link href={`/buy/${primaryCity.slug}`}>
                    <Button size="lg">مشاهده آگهی‌های خرید وام</Button>
                  </Link>
                  <Link href={`/sell/${primaryCity.slug}`}>
                    <Button size="lg" variant="outline">
                      ثبت آگهی فروش وام
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/ads/create">
                  <Button size="lg">ثبت آگهی جدید</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {trustPoints.map((point) => (
              <Card key={point.title} className="sm:col-span-1 col-span-3">
                <CardBody className="flex flex-col items-start gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                    <point.icon size={19} />
                  </span>
                  <h3 className="text-sm font-bold text-neutral-800">{point.title}</h3>
                  <p className="text-xs leading-6 text-neutral-500">{point.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {cities.length > 0 && (
        <section className="container-page py-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
              <MapPin size={20} className="text-primary-600" />
              شهرهای پرطرفدار
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cities.slice(0, 8).map((city) => (
              <Card key={city.id} className="hover:shadow-card-hover">
                <CardBody>
                  <p className="mb-3 font-bold text-neutral-800">{city.name}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/buy/${city.slug}`}
                      className="flex-1 rounded-lg bg-primary-50 py-1.5 text-center text-xs font-medium text-primary-700 hover:bg-primary-100"
                    >
                      خرید وام
                    </Link>
                    <Link
                      href={`/sell/${city.slug}`}
                      className="flex-1 rounded-lg bg-accent-50 py-1.5 text-center text-xs font-medium text-accent-700 hover:bg-accent-100"
                    >
                      فروش وام
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      {banks.length > 0 && (
        <section className="bg-neutral-50 py-14">
          <div className="container-page">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900">
              <Landmark size={20} className="text-primary-600" />
              بانک‌های فعال در وامنو
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {banks.slice(0, 12).map((bank) => (
                <Link
                  key={bank.id}
                  href={`/banks/${bank.slug}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-card hover:shadow-card-hover"
                >
                  {bank.logo ? (
                    <Image
                      src={bank.logo}
                      alt={`لوگوی ${bank.name}`}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {bank.name.charAt(0)}
                    </span>
                  )}
                  <span className="text-xs font-medium text-neutral-700">{bank.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {latestAds && latestAds.results.length > 0 && (
        <section className="container-page py-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">جدیدترین آگهی‌ها</h2>
            {primaryCity && (
              <Link
                href={`/buy/${primaryCity.slug}`}
                className="flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline"
              >
                مشاهده همه
                <ArrowLeft size={15} />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {latestAds.results.slice(0, 8).map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page pb-16">
        <div className="rounded-2xl bg-navy-900 px-8 py-10 text-center text-white">
          <h2 className="mb-3 text-xl font-bold">آگهی خرید یا فروش وام دارید؟</h2>
          <p className="mx-auto mb-6 max-w-xl text-sm text-neutral-300">
            همین حالا ثبت‌نام کنید و آگهی خود را رایگان در وامنو ثبت کنید تا در معرض دید هزاران کاربر قرار بگیرد.
          </p>
          <Link href="/ads/create">
            <Button variant="accent" size="lg">
              ثبت آگهی رایگان
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

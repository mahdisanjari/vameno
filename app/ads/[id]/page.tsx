import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Landmark, CalendarDays, User } from "lucide-react";
import { serverFetchOrNull } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { formatDate, formatToman } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PhoneRevealButton } from "@/components/ads/PhoneRevealButton";
import type { AdDetail } from "@/lib/types";

interface PageProps {
  params: { id: string };
}

async function getAd(id: string) {
  return serverFetchOrNull<AdDetail>(`/api/ads/${id}/`, { revalidate: 60 });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ad = await getAd(params.id);
  if (!ad) return {};

  const label = ad.ad_type === "buy" ? "متقاضی خرید وام" : "فروش وام";
  const description = `${label} در ${ad.city.name} به مبلغ ${formatToman(ad.amount)}. ${ad.description?.slice(0, 120) ?? ""}`;

  return {
    title: ad.title,
    description,
    alternates: { canonical: `/ads/${ad.id}` },
    openGraph: { type: "article", title: ad.title, description },
  };
}

export default async function AdDetailPage({ params }: PageProps) {
  const ad = await getAd(params.id);
  if (!ad) notFound();

  const label = ad.ad_type_display ?? (ad.ad_type === "buy" ? "متقاضی خرید وام" : "فروش وام");
  const cityHref = `/${ad.ad_type}/${ad.city.slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ad.title,
    description: ad.description ?? ad.title,
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: ad.amount,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/ads/${ad.id}`,
    },
  };

  return (
    <div className="container-page py-8">
      <JsonLd data={productJsonLd} />
      <Breadcrumbs
        items={[
          { label: ad.ad_type === "buy" ? "خرید وام" : "فروش وام", href: cityHref },
          { label: ad.city.name, href: cityHref },
          { label: ad.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardBody>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant={ad.ad_type === "buy" ? "primary" : "accent"}>{label}</Badge>
              {ad.loan_type && <Badge variant="neutral">{ad.loan_type.name}</Badge>}
              {ad.status_display && <Badge variant={ad.is_expired ? "neutral" : "success"}>{ad.status_display}</Badge>}
            </div>

            <h1 className="mb-3 text-2xl font-extrabold text-neutral-900">{ad.title}</h1>
            <p className="mb-6 text-2xl font-extrabold text-primary-700">{formatToman(ad.amount)}</p>

            <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4 text-sm sm:grid-cols-4">
              <div className="flex flex-col items-center gap-1 text-center">
                <MapPin size={16} className="text-primary-600" />
                <span className="text-neutral-500">شهر</span>
                <span className="font-medium text-neutral-800">{ad.city.name}</span>
              </div>
              {ad.bank && (
                <div className="flex flex-col items-center gap-1 text-center">
                  <Landmark size={16} className="text-primary-600" />
                  <span className="text-neutral-500">بانک</span>
                  <span className="font-medium text-neutral-800">{ad.bank.name}</span>
                </div>
              )}
              <div className="flex flex-col items-center gap-1 text-center">
                <CalendarDays size={16} className="text-primary-600" />
                <span className="text-neutral-500">تاریخ ثبت</span>
                <span className="font-medium text-neutral-800">{formatDate(ad.created_at)}</span>
              </div>
              {ad.user_name && (
                <div className="flex flex-col items-center gap-1 text-center">
                  <User size={16} className="text-primary-600" />
                  <span className="text-neutral-500">آگهی‌دهنده</span>
                  <span className="font-medium text-neutral-800">{ad.user_name}</span>
                </div>
              )}
            </div>

            {ad.description && (
              <div>
                <h2 className="mb-2 text-base font-bold text-neutral-800">توضیحات</h2>
                <p className="whitespace-pre-line text-sm leading-7 text-neutral-600">{ad.description}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="h-fit">
          <CardBody>
            <h2 className="mb-3 text-sm font-bold text-neutral-800">اطلاعات تماس</h2>
            <p className="mb-4 text-xs leading-6 text-neutral-500">
              برای مشاهده شماره تماس آگهی‌دهنده روی دکمه زیر بزنید. کاربران مهمان تا سه بار می‌توانند
              رایگان از این امکان استفاده کنند.
            </p>
            <PhoneRevealButton adId={ad.id} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

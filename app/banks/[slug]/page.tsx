import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Landmark, ArrowLeft, Globe } from "lucide-react";
import { serverFetchOrNull } from "@/lib/api";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReadMoreRichText } from "@/components/ReadMoreRichText";
import { Card, CardBody } from "@/components/ui/card";
import { formatToman } from "@/lib/utils";
import type { BankDetailResponse } from "@/lib/types";

interface PageProps {
  params: { slug: string };
}

async function getBankDetail(slug: string) {
  return serverFetchOrNull<BankDetailResponse>(`/api/banks/${encodeURIComponent(slug)}/`, {
    revalidate: 600,
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getBankDetail(params.slug);
  if (!data) return {};
  const { bank } = data;

  return {
    title: bank.meta_title || `وام‌های ${bank.name}`,
    description: bank.meta_description || `لیست کامل وام‌های ${bank.name} و آگهی‌های مرتبط در وامنو.`,
    alternates: { canonical: `/banks/${bank.slug}` },
  };
}

export default async function BankPage({ params }: PageProps) {
  const data = await getBankDetail(params.slug);
  if (!data) notFound();

  const { bank, loans } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: bank.name,
    description: bank.description || bank.name,
  };

  return (
    <div className="container-page py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "بانک‌ها" }, { label: bank.name }]} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {bank.logo ? (
          <Image
            src={bank.logo}
            alt={`لوگوی ${bank.name}`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
            <Landmark size={26} />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">{bank.name}</h1>
          <p className="text-sm text-neutral-500">وام‌ها و خدمات {bank.name}</p>
        </div>
        {bank.website && (
          <a
            href={bank.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-auto flex items-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            <Globe size={15} />
            وبسایت رسمی
          </a>
        )}
      </div>

      {bank.description && <p className="mb-6 text-sm leading-7 text-neutral-600">{bank.description}</p>}

      {bank.rich_content && (
        <div className="mb-10">
          <ReadMoreRichText html={bank.rich_content} />
          
        </div>
      )}

      <h2 className="mb-4 text-lg font-bold text-neutral-800">وام‌های {bank.name}</h2>
      {loans.length === 0 ? (
        <p className="text-sm text-neutral-500">در حال حاضر وامی برای این بانک ثبت نشده است.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <Link key={loan.id} href={`/loan/${bank.slug}/${loan.slug}`}>
              <Card className="h-full hover:shadow-card-hover">
                <CardBody className="flex flex-col gap-2">
                  <h3 className="font-bold text-neutral-800">{loan.name}</h3>
                  {loan.short_description && (
                    <p className="line-clamp-2 text-xs text-neutral-500">{loan.short_description}</p>
                  )}
                  {loan.max_amount && (
                    <p className="text-xs text-neutral-500">سقف وام: {formatToman(loan.max_amount)}</p>
                  )}
                  <span className="mt-2 flex items-center gap-1 text-sm font-medium text-primary-700">
                    جزئیات و شرایط
                    <ArrowLeft size={14} />
                  </span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

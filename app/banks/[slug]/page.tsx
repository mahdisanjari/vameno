import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Landmark, ArrowLeft } from "lucide-react";
import { serverFetchAllPages, serverFetchOrNull } from "@/lib/api";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RichText } from "@/components/RichText";
import { Card, CardBody } from "@/components/ui/card";
import type { Bank, Loan } from "@/lib/types";

interface PageProps {
  params: { slug: string };
}

async function getBank(slug: string) {
  return serverFetchOrNull<Bank>(`/api/banks/${encodeURIComponent(slug)}/`, { revalidate: 600 });
}

async function getBankLoans(slug: string) {
  try {
    return await serverFetchAllPages<Loan>(`/api/banks/loans/?bank=${encodeURIComponent(slug)}`, {
      revalidate: 600,
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bank = await getBank(params.slug);
  if (!bank) return {};

  return {
    title: bank.meta_title || `وام‌های ${bank.name}`,
    description: bank.meta_description || `لیست کامل وام‌های ${bank.name} و آگهی‌های مرتبط در وامنو.`,
    alternates: { canonical: `/banks/${bank.slug}` },
  };
}

export default async function BankPage({ params }: PageProps) {
  const bank = await getBank(params.slug);
  if (!bank) notFound();

  const loans = await getBankLoans(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: bank.name,
    description: bank.description ?? bank.name,
  };

  return (
    <div className="container-page py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "بانک‌ها" }, { label: bank.name }]} />

      <div className="mb-8 flex items-center gap-3">
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
      </div>

      {bank.description && (
        <div className="mb-8">
          <RichText html={bank.description} />
        </div>
      )}

      <h2 className="mb-4 text-lg font-bold text-neutral-800">وام‌های {bank.name}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loans.map((loan) => (
          <Link key={loan.id} href={`/loan/${bank.slug}/${loan.slug}`}>
            <Card className="h-full hover:shadow-card-hover">
              <CardBody className="flex flex-col gap-2">
                <h3 className="font-bold text-neutral-800">{loan.name}</h3>
                {loan.max_amount && (
                  <p className="text-xs text-neutral-500">سقف وام: {loan.max_amount.toLocaleString("fa-IR")} تومان</p>
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
    </div>
  );
}

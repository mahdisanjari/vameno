import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landmark, Percent, Wallet, CalendarClock } from "lucide-react";
import { serverFetchOrNull } from "@/lib/api";
import { formatToman } from "@/lib/utils";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RichText } from "@/components/RichText";
import { Card, CardBody } from "@/components/ui/card";
import type { Loan } from "@/lib/types";

interface PageProps {
  params: { bank: string; loan: string };
}

async function getLoan(bankSlug: string, loanSlug: string) {
  return serverFetchOrNull<Loan>(
    `/api/banks/${encodeURIComponent(bankSlug)}/loans/${encodeURIComponent(loanSlug)}/`,
    { revalidate: 600 },
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const loan = await getLoan(params.bank, params.loan);
  if (!loan) return {};

  return {
    title: loan.meta_title || `${loan.name} | ${loan.bank.name}`,
    description: loan.meta_description || `شرایط، سقف و نرخ سود ${loan.name} در ${loan.bank.name}.`,
    alternates: { canonical: `/loan/${params.bank}/${params.loan}` },
  };
}

export default async function LoanPage({ params }: PageProps) {
  const loan = await getLoan(params.bank, params.loan);
  if (!loan) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: loan.name,
    provider: { "@type": "BankOrCreditUnion", name: loan.bank.name },
    interestRate: loan.interest_rate,
  };

  return (
    <div className="container-page max-w-4xl py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { label: loan.bank.name, href: `/banks/${loan.bank.slug}` },
          { label: loan.name },
        ]}
      />

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
          <Landmark size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">{loan.name}</h1>
          <p className="text-sm text-neutral-500">ارائه شده توسط {loan.bank.name}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loan.max_amount && (
          <Card>
            <CardBody className="flex flex-col items-center gap-1 text-center">
              <Wallet size={18} className="text-primary-600" />
              <span className="text-xs text-neutral-500">سقف وام</span>
              <span className="text-sm font-bold text-neutral-800">{formatToman(loan.max_amount)}</span>
            </CardBody>
          </Card>
        )}
        {loan.min_amount && (
          <Card>
            <CardBody className="flex flex-col items-center gap-1 text-center">
              <Wallet size={18} className="text-primary-600" />
              <span className="text-xs text-neutral-500">حداقل وام</span>
              <span className="text-sm font-bold text-neutral-800">{formatToman(loan.min_amount)}</span>
            </CardBody>
          </Card>
        )}
        {loan.interest_rate && (
          <Card>
            <CardBody className="flex flex-col items-center gap-1 text-center">
              <Percent size={18} className="text-primary-600" />
              <span className="text-xs text-neutral-500">نرخ سود</span>
              <span className="text-sm font-bold text-neutral-800">{loan.interest_rate}</span>
            </CardBody>
          </Card>
        )}
        {loan.max_duration_months && (
          <Card>
            <CardBody className="flex flex-col items-center gap-1 text-center">
              <CalendarClock size={18} className="text-primary-600" />
              <span className="text-xs text-neutral-500">حداکثر مدت بازپرداخت</span>
              <span className="text-sm font-bold text-neutral-800">{loan.max_duration_months} ماه</span>
            </CardBody>
          </Card>
        )}
      </div>

      {loan.rich_content && <RichText html={loan.rich_content} />}

      <div className="mt-10 rounded-2xl bg-primary-50 p-6 text-center">
        <p className="mb-4 text-sm text-primary-800">
          به دنبال خرید یا فروش این نوع وام هستید؟ آگهی‌های مربوطه را در شهر خود جستجو کنید یا آگهی
          جدید ثبت نمایید.
        </p>
        <a
          href="/ads/create"
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          ثبت آگهی جدید
        </a>
      </div>
    </div>
  );
}

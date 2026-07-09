import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CreateAdForm } from "./CreateAdForm";
import { serverFetch, serverFetchAllPages } from "@/lib/api";
import type { Bank, City, Loan } from "@/lib/types";

export const metadata: Metadata = {
  title: "ثبت آگهی جدید",
  description: "آگهی خرید یا فروش وام خود را در وامنو ثبت کنید.",
  alternates: { canonical: "/ads/create" },
};

async function getFormData() {
  try {
    const [cities, banks] = await Promise.all([
      serverFetch<City[]>("/api/locations/cities/", { revalidate: 3600 }),
      serverFetchAllPages<Bank>("/api/banks/", { revalidate: 3600 }),
    ]);

    // Since loans are now nested within banks, we flatten them into a single array
    // and attach bank info to each loan for filtering in the form.
    const loans = banks.flatMap(
      (bank) => (bank.loans ?? []).map((loan) => ({ ...loan, bank: { id: bank.id, name: bank.name, slug: bank.slug } })) as Loan[],
    );

    return { cities, banks, loans };
  } catch {
    return { cities: [] as City[], banks: [] as Bank[], loans: [] as Loan[] };
  }
}

export default async function CreateAdPage() {
  const { cities, banks, loans } = await getFormData();
  return (
    <div className="container-page max-w-2xl py-8">
      <Breadcrumbs items={[{ label: "ثبت آگهی جدید" }]} />
      <h1 className="mb-1 text-2xl font-extrabold text-neutral-900">ثبت آگهی جدید</h1>
      <p className="mb-6 text-sm text-neutral-500">
        اطلاعات زیر را با دقت تکمیل کنید. آگهی شما پس از بررسی در سایت منتشر می‌شود.
      </p>
      <CreateAdForm cities={cities} banks={banks} loans={loans} />
    </div>
  );
}

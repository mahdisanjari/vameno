"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Bank, Loan } from "@/lib/types";
import type { AdOrdering } from "@/lib/city-page";

interface AdFilterSidebarProps {
  banks: Bank[];
  loanTypes: Loan[];
}

const orderingOptions: { value: AdOrdering; label: string }[] = [
  { value: "-created_at", label: "جدیدترین" },
  { value: "created_at", label: "قدیمی‌ترین" },
  { value: "-amount", label: "بیشترین مبلغ" },
  { value: "amount", label: "کمترین مبلغ" },
  { value: "-views_count", label: "پربازدیدترین" },
];

export function AdFilterSidebar({ banks, loanTypes }: AdFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  // `bank` is sent to the API as a real filter, and also narrows the loan-type options below.
  const [bank, setBank] = useState(searchParams.get("bank") ?? "");
  const [loanType, setLoanType] = useState(searchParams.get("loan_type") ?? "");
  const [minAmount, setMinAmount] = useState(searchParams.get("min_amount") ?? "");
  const [maxAmount, setMaxAmount] = useState(searchParams.get("max_amount") ?? "");
  const [ordering, setOrdering] = useState(searchParams.get("ordering") ?? "");

  const visibleLoanTypes = useMemo(
    () => (bank ? loanTypes.filter((loan) => loan.bank?.slug === bank) : loanTypes),
    [loanTypes, bank],
  );

  function handleBankChange(value: string) {
    setBank(value);
    setLoanType("");
  }

  function applyFilters() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (bank) params.set("bank", bank);
    if (loanType) params.set("loan_type", loanType);
    if (minAmount) params.set("min_amount", minAmount);
    if (maxAmount) params.set("max_amount", maxAmount);
    if (ordering) params.set("ordering", ordering);
    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilters() {
    setSearch("");
    setBank("");
    setLoanType("");
    setMinAmount("");
    setMaxAmount("");
    setOrdering("");
    router.push(pathname);
  }

  return (
    <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2 text-neutral-800">
        <SlidersHorizontal size={17} />
        <h2 className="font-bold">فیلتر آگهی‌ها</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="search">جستجو</Label>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در عنوان و توضیحات آگهی..."
              className="pr-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bank">بانک</Label>
          <Select id="bank" value={bank} onChange={(e) => handleBankChange(e.target.value)}>
            <option value="">همه بانک‌ها</option>
            {banks.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="loan_type">نوع وام</Label>
          <Select id="loan_type" value={loanType} onChange={(e) => setLoanType(e.target.value)}>
            <option value="">همه وام‌ها</option>
            {visibleLoanTypes.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="ordering">مرتب‌سازی</Label>
          <Select id="ordering" value={ordering} onChange={(e) => setOrdering(e.target.value)}>
            <option value="">پیش‌فرض</option>
            {orderingOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="min_amount">حداقل مبلغ</Label>
            <Input
              id="min_amount"
              type="number"
              inputMode="numeric"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="تومان"
            />
          </div>
          <div>
            <Label htmlFor="max_amount">حداکثر مبلغ</Label>
            <Input
              id="max_amount"
              type="number"
              inputMode="numeric"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="تومان"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button onClick={applyFilters} className="flex-1">
            اعمال فیلتر
          </Button>
          <Button onClick={resetFilters} variant="outline">
            حذف فیلترها
          </Button>
        </div>
      </div>
    </aside>
  );
}

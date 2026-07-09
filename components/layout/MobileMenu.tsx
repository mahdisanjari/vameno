"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import type { Bank, City } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  banks: Bank[];
  featuredCities: City[];
}

export function MobileMenu({ banks, featuredCities }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<"banks" | "cities" | null>(null);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="باز کردن منو"
        className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-neutral-900/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl animate-slide-up" dir="rtl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold text-primary-700">وامنو</span>
              <button onClick={() => setOpen(false)} aria-label="بستن" className="rounded-full p-1.5 hover:bg-neutral-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <button
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                onClick={() => setExpanded(expanded === "banks" ? null : "banks")}
              >
                بانک‌ها و وام‌ها
                <ChevronDown size={16} className={cn("transition-transform", expanded === "banks" && "rotate-180")} />
              </button>
              {expanded === "banks" && (
                <div className="space-y-3 rounded-lg bg-neutral-50 p-3">
                  {banks.map((bank) => (
                    <div key={bank.id}>
                      <Link
                        href={`/banks/${bank.slug}`}
                        onClick={() => setOpen(false)}
                        className="mb-1 block text-sm font-bold text-primary-700"
                      >
                        {bank.name}
                      </Link>
                      <ul className="space-y-1 pr-3">
                        {(bank.loans ?? []).slice(0, 4).map((loan) => (
                          <li key={loan.id}>
                            <Link
                              href={`/loan/${bank.slug}/${loan.slug}`}
                              onClick={() => setOpen(false)}
                              className="text-xs text-neutral-600"
                            >
                              {loan.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                onClick={() => setExpanded(expanded === "cities" ? null : "cities")}
              >
                شهرهای پرطرفدار
                <ChevronDown size={16} className={cn("transition-transform", expanded === "cities" && "rotate-180")} />
              </button>
              {expanded === "cities" && (
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-50 p-3">
                  {featuredCities.map((city) => (
                    <div key={city.id} className="space-y-1">
                      <p className="text-xs font-bold text-neutral-800">{city.name}</p>
                      <Link href={`/buy/${city.slug}`} onClick={() => setOpen(false)} className="block text-xs text-primary-700">
                        خرید وام
                      </Link>
                      <Link href={`/sell/${city.slug}`} onClick={() => setOpen(false)} className="block text-xs text-accent-700">
                        فروش وام
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              <Link href="/subscription" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
                اشتراک
              </Link>
              <Link href="/terms" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
                قوانین و مقررات
              </Link>
              <Link href="/contact-us" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
                تماس با ما
              </Link>
              <Link href="/about-us" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
                درباره ما
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

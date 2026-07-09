"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, Landmark, MapPin } from "lucide-react";
import type { Bank, City } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  banks: Bank[];
  featuredCities: City[];
}

export function MegaMenu({ banks, featuredCities }: MegaMenuProps) {
  const [openMenu, setOpenMenu] = useState<"banks" | "cities" | null>(null);
  const [activeBankId, setActiveBankId] = useState<string | null>(banks[0]?.id ?? null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeBank = useMemo(
    () => banks.find((bank) => bank.id === activeBankId) ?? banks[0],
    [banks, activeBankId],
  );

  const handleEnter = (menu: "banks" | "cities") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  return (
    <nav className="hidden items-center gap-1 lg:flex" dir="rtl">
      <div
        className="relative"
        onMouseEnter={() => handleEnter("banks")}
        onMouseLeave={handleLeave}
      >
        <button
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-700",
            openMenu === "banks" && "bg-neutral-100 text-primary-700",
          )}
        >
          <Landmark size={16} />
          بانک‌ها و وام‌ها
          <ChevronDown size={14} className={cn("transition-transform", openMenu === "banks" && "rotate-180")} />
        </button>

        {openMenu === "banks" && banks.length > 0 && (
          <div className="absolute right-0 top-full z-40 mt-2 flex w-[600px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card-hover animate-fade-in">
            <ul className="w-52 shrink-0 border-l border-neutral-100 bg-neutral-50 py-2">
              {banks.map((bank) => (
                <li key={bank.id}>
                  <button
                    onMouseEnter={() => setActiveBankId(bank.id)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-right text-sm font-medium transition-colors",
                      activeBank?.id === bank.id
                        ? "bg-white text-primary-700"
                        : "text-neutral-600 hover:bg-white/60 hover:text-neutral-800",
                    )}
                  >
                    {bank.name}
                    <ChevronLeft size={14} className="text-neutral-300" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex-1 p-5">
              {activeBank && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-800">وام‌های {activeBank.name}</h3>
                    <Link href={`/banks/${activeBank.slug}`} className="text-xs font-medium text-primary-700 hover:underline">
                      مشاهده صفحه بانک
                    </Link>
                  </div>
                  {(activeBank?.loans?.length ?? 0) > 0 ? (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {(activeBank.loans ?? []).map((loan) => (
                        <li key={loan.id}>
                          <Link
                            href={`/loan/${activeBank.slug}/${loan.slug}`}
                            className="block rounded-lg px-2 py-1.5 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-700"
                          >
                            {loan.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-400">وامی برای این بانک ثبت نشده است.</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className="relative"
        onMouseEnter={() => handleEnter("cities")}
        onMouseLeave={handleLeave}
      >
        <button
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-700",
            openMenu === "cities" && "bg-neutral-100 text-primary-700",
          )}
        >
          <MapPin size={16} />
          شهرهای پرطرفدار
          <ChevronDown size={14} className={cn("transition-transform", openMenu === "cities" && "rotate-180")} />
        </button>

        {openMenu === "cities" && (
          <div className="absolute right-0 top-full z-40 mt-2 w-[420px] rounded-2xl border border-neutral-200 bg-white p-5 shadow-card-hover animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {featuredCities.map((city) => (
                <div key={city.id} className="rounded-xl border border-neutral-100 p-3">
                  <p className="mb-2 text-sm font-bold text-neutral-800">{city.name}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/buy/${city.slug}`}
                      className="flex-1 rounded-lg bg-primary-50 px-2 py-1.5 text-center text-xs font-medium text-primary-700 hover:bg-primary-100"
                    >
                      خرید وام
                    </Link>
                    <Link
                      href={`/sell/${city.slug}`}
                      className="flex-1 rounded-lg bg-accent-50 px-2 py-1.5 text-center text-xs font-medium text-accent-700 hover:bg-accent-100"
                    >
                      فروش وام
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link href="/subscription" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-700">
        اشتراک
      </Link>
      <Link href="/terms" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-700">
        قوانین و مقررات
      </Link>
      <Link href="/contact-us" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-700">
        تماس با ما
      </Link>
    </nav>
  );
}

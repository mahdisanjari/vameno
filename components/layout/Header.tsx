import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { serverFetch, serverFetchAllPages } from "@/lib/api";
import type { Bank, City } from "@/lib/types";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { AuthNav } from "./AuthNav";

async function getMenuData(): Promise<{ banks: Bank[]; featuredCities: City[] }> {
  try {
    const [banks, featuredCities] = await Promise.all([
      serverFetchAllPages<Bank>("/api/banks/", { revalidate: 300 }),
      serverFetch<City[]>("/api/locations/cities/?featured=true", { revalidate: 300 }),
    ]);

    return { banks, featuredCities };
  } catch {
    return { banks: [], featuredCities: [] };
  }
}

export async function Header() {
  const { banks, featuredCities } = await getMenuData();

  return (
    /* The bar stays lapis in every context — the same ground the mark itself
       lives on. A gold hairline replaces the usual grey border and shadow. */
    <header className="sticky top-0 z-30 border-b border-accent-500/25 bg-navy-950">
      <div className="container-page flex h-[70px] items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} — صفحه اصلی`}>
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-accent-500/50 text-accent-500">
              <ShieldCheck size={19} strokeWidth={1.5} />
            </span>
            <span className="nastaliq text-[1.7rem] leading-[1.9] text-accent-500">{SITE_NAME}</span>
          </Link>
          <MegaMenu banks={banks} featuredCities={featuredCities} />
        </div>

        <div className="flex items-center gap-2">
          <AuthNav />
          <MobileMenu banks={banks} featuredCities={featuredCities} />
        </div>
      </div>
    </header>
  );
}

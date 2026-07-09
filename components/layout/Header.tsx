import Link from "next/link";
import { Landmark } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Landmark size={19} />
            </span>
            <span className="text-lg font-extrabold text-primary-800">وامنو</span>
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

import Link from "next/link";
import { ChevronRight, ChevronLeft, PackageSearch } from "lucide-react";
import { AdCard } from "./AdCard";
import type { PaginatedResponse, Ad } from "@/lib/types";

interface AdListProps {
  data: PaginatedResponse<Ad>;
  currentPage: number;
  buildPageHref: (page: number) => string;
}

export function AdList({ data, currentPage, buildPageHref }: AdListProps) {
  if (data.results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
        <PackageSearch size={40} className="mb-3 text-neutral-300" />
        <p className="font-medium text-neutral-600">آگهی‌ای با این فیلترها یافت نشد</p>
        <p className="mt-1 text-sm text-neutral-400">فیلترها را تغییر دهید یا بعداً دوباره سر بزنید.</p>
      </div>
    );
  }

  const pageSize = data.results.length || 1;
  const totalPages = Math.max(1, Math.ceil(data.count / pageSize));

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.results.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {(data.next || data.previous) && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href={buildPageHref(currentPage - 1)}
            aria-disabled={!data.previous}
            className={`flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium ${
              data.previous
                ? "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                : "pointer-events-none border-neutral-100 text-neutral-300"
            }`}
          >
            <ChevronRight size={16} />
            قبلی
          </Link>
          <span className="text-sm text-neutral-500">
            صفحه {currentPage} از {totalPages}
          </span>
          <Link
            href={buildPageHref(currentPage + 1)}
            aria-disabled={!data.next}
            className={`flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium ${
              data.next
                ? "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                : "pointer-events-none border-neutral-100 text-neutral-300"
            }`}
          >
            بعدی
            <ChevronLeft size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}

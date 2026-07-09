import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { JsonLd } from "./JsonLd";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [{ label: "خانه", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href ?? ""}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="مسیر صفحه" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/" className="flex items-center gap-1 hover:text-primary-700">
          <Home size={14} />
          خانه
        </Link>
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-1.5">
            <ChevronLeft size={14} className="text-neutral-300" />
            {item.href && index !== items.length - 1 ? (
              <Link href={item.href} className="hover:text-primary-700">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-neutral-700">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

import type { Metadata } from "next";
import { Check, Sparkles, BadgePercent } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { cn, formatToman } from "@/lib/utils";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card, CardBody } from "@/components/ui/card";
import { PurchaseButton } from "./PurchaseButton";
import type { SubscriptionPlan } from "@/lib/types";

export const metadata: Metadata = {
  title: "پلن‌های اشتراک",
  description: "با تهیه اشتراک وامنو، بدون محدودیت به شماره تماس آگهی‌های خرید و فروش وام دسترسی داشته باشید.",
  alternates: { canonical: "/subscription" },
};

async function getPlans() {
  try {
    return await serverFetch<SubscriptionPlan[]>("/api/subscriptions/plans/", { revalidate: 300 });
  } catch {
    return [];
  }
}

export default async function SubscriptionPage() {
  const plans = await getPlans();

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "پلن‌های اشتراک" }]} />

      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
          <Sparkles size={14} /> دسترسی نامحدود به شماره تماس آگهی‌ها
        </span>
        <h1 className="mb-3 text-2xl font-extrabold text-neutral-900">پلن اشتراک خود را انتخاب کنید</h1>
        <p className="text-sm leading-7 text-neutral-600">
          بعد از سه بار مشاهده رایگان شماره تماس، برای ادامه استفاده از این امکان نیاز به تهیه یکی
          از پلن‌های زیر دارید. اشتراک‌ها بلافاصله پس از خرید فعال می‌شوند.
        </p>
      </div>

      {plans.length === 0 ? (
        <p className="text-center text-sm text-neutral-500">در حال حاضر پلنی برای نمایش وجود ندارد.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const hasDiscount = !!plan.discount_percentage && plan.discount_percentage > 0;
            const featureLines = plan.description?.split("\n").map((l) => l.trim()).filter(Boolean) ?? [];

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex h-full flex-col",
                  plan.is_featured && "border-2 border-accent-400 shadow-card-hover",
                )}
              >
                {plan.is_featured && (
                  <span className="absolute -top-3 right-1/2 translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
                    پرطرفدارترین
                  </span>
                )}
                <CardBody className="flex flex-1 flex-col gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">{plan.name}</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      {plan.duration_display || `اعتبار ${plan.duration_days} روزه`}
                    </p>
                  </div>

                  <div>
                    {hasDiscount && (
                      <div className="mb-1 flex items-center gap-2 text-xs text-accent-700">
                        <BadgePercent size={14} />
                        {plan.discount_percentage}٪ تخفیف
                        {plan.savings && <span className="text-neutral-400 line-through">{plan.savings}</span>}
                      </div>
                    )}
                    <p className="text-3xl font-extrabold text-primary-700">
                      {formatToman(hasDiscount ? plan.discounted_price : plan.price)}
                    </p>
                    {plan.price_per_month && (
                      <p className="mt-1 text-xs text-neutral-400">{formatToman(plan.price_per_month)} در ماه</p>
                    )}
                  </div>

                  {featureLines.length > 0 ? (
                    <ul className="flex-1 space-y-2 text-sm text-neutral-600">
                      {featureLines.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check size={16} className="text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex-1" />
                  )}

                  <PurchaseButton planId={plan.id} isPopular={!!plan.is_featured} />
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

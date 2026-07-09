"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { List, CreditCard, UserCog } from "lucide-react";
import { cn, formatDate, formatToman } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import type { Ad, PaginatedResponse, Subscription } from "@/lib/types";
import { ProfileForm } from "./ProfileForm";

type Tab = "ads" | "subscription" | "profile";

function unwrapList<T>(data: T[] | PaginatedResponse<T> | null): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

export function DashboardTabs() {
  const [tab, setTab] = useState<Tab>("ads");
  const { user } = useAuth();

  const tabs: { key: Tab; label: string; icon: typeof List }[] = [
    { key: "ads", label: "آگهی‌های من", icon: List },
    { key: "subscription", label: "اشتراک من", icon: CreditCard },
    { key: "profile", label: "پروفایل", icon: UserCog },
  ];

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-neutral-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-neutral-500 hover:text-neutral-700",
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ads" && <MyAdsTab />}
      {tab === "subscription" && <SubscriptionTab />}
      {tab === "profile" && user && <ProfileForm user={user} />}
    </div>
  );
}

function MyAdsTab() {
  const [ads, setAds] = useState<Ad[] | null>(null);

  useEffect(() => {
    fetch("/api/ads/my-ads", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAds(unwrapList<Ad>(data)))
      .catch(() => setAds([]));
  }, []);

  if (ads === null) {
    return <p className="text-sm text-neutral-500">در حال بارگذاری...</p>;
  }

  if (ads.length === 0) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-neutral-500">شما هنوز هیچ آگهی ثبت نکرده‌اید.</p>
          <Link href="/ads/create">
            <Button size="sm">ثبت آگهی جدید</Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {ads.map((ad) => (
        <Card key={ad.id}>
          <CardBody className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link href={`/ads/${ad.id}`} className="font-bold text-neutral-800 hover:text-primary-700">
                {ad.title}
              </Link>
              <p className="mt-1 text-xs text-neutral-500">
                {ad.city_name} · {formatToman(ad.amount)} · {formatDate(ad.created_at)}
              </p>
            </div>
            <Badge variant={ad.status === "active" ? "success" : "neutral"}>
              {ad.status_display ?? (ad.status === "active" ? "فعال" : "غیرفعال")}
            </Badge>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function SubscriptionTab() {
  const [subscription, setSubscription] = useState<Subscription | null | undefined>(undefined);
  const [history, setHistory] = useState<Subscription[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/subscriptions/my-subscription", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setSubscription)
      .catch(() => setSubscription(null));

    fetch("/api/subscriptions/history", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setHistory(unwrapList<Subscription>(data)))
      .catch(() => setHistory([]));
  }, []);

  async function handleCancel() {
    const res = await fetch("/api/subscriptions/cancel", { method: "POST" });
    if (res.ok) {
      showToast("اشتراک شما لغو شد", "success");
      setSubscription(null);
    } else {
      showToast("لغو اشتراک ناموفق بود", "error");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <h2 className="mb-3 text-sm font-bold text-neutral-800">وضعیت اشتراک فعلی</h2>
          {subscription === undefined && <p className="text-sm text-neutral-500">در حال بارگذاری...</p>}
          {subscription === null && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-neutral-500">شما در حال حاضر اشتراک فعالی ندارید.</p>
              <Link href="/subscription">
                <Button size="sm">خرید اشتراک</Button>
              </Link>
            </div>
          )}
          {subscription && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-neutral-800">{subscription.plan.name}</p>
                <p className="text-xs text-neutral-500">
                  اعتبار تا {formatDate(subscription.expires_at)}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                لغو اشتراک
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="mb-3 text-sm font-bold text-neutral-800">تاریخچه خرید اشتراک</h2>
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-neutral-100 pb-2 text-sm last:border-0">
                  <span className="text-neutral-700">{item.plan.name}</span>
                  <span className="text-neutral-500">{formatDate(item.starts_at)}</span>
                  <span className="font-medium text-neutral-800">{formatToman(item.price_paid)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

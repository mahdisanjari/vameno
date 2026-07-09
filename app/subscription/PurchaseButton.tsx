"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";

export function PurchaseButton({ planId, isPopular }: { planId: string; isPopular: boolean }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  async function handlePurchase() {
    if (!user) {
      router.push(`/auth/login?next=/subscription`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.detail ?? "خرید اشتراک ناموفق بود", "error");
        return;
      }

      showToast("اشتراک شما با موفقیت فعال شد", "success");
      router.push("/dashboard");
      router.refresh();
    } catch {
      showToast("ارتباط با سرور برقرار نشد", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handlePurchase} disabled={loading} variant={isPopular ? "accent" : "primary"} className="w-full">
      {loading && <Loader2 size={16} className="animate-spin" />}
      خرید این پلن
    </Button>
  );
}

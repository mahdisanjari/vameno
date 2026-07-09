"use client";

import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaywallModal } from "./PaywallModal";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import type { ViewPhoneErrorResponse, ViewPhoneResponse } from "@/lib/types";

export function PhoneRevealButton({ adId }: { adId: string }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  async function handleReveal() {
    if (phone) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/${adId}/view-phone`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        const success = data as ViewPhoneResponse;
        setPhone(success.phone_number);
        if (typeof success.remaining_views === "number") {
          showToast(`${success.remaining_views} مشاهده رایگان دیگر باقی مانده است`, "info");
        }
        return;
      }

      const errorData = data as ViewPhoneErrorResponse;
      if (res.status === 403 && errorData.error === "subscription_required") {
        setShowPaywall(true);
        return;
      }
      if (res.status === 401) {
        setShowPaywall(true);
        return;
      }
      showToast(errorData.detail ?? "خطایی رخ داد، دوباره تلاش کنید", "error");
    } catch {
      showToast("ارتباط با سرور برقرار نشد", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={handleReveal}
        disabled={loading}
        variant={phone ? "outline" : "primary"}
        size="sm"
        className="w-full"
        dir="ltr"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Phone size={16} />
        )}
        <span dir="rtl">{phone ?? "مشاهده شماره تماس"}</span>
      </Button>

      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} isAuthenticated={!!user} />
    </>
  );
}

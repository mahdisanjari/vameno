"use client";

import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}

export function PaywallModal({ open, onClose, isAuthenticated }: PaywallModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-600">
          <Lock size={26} />
        </span>
        <h3 className="mb-2 text-lg font-bold text-neutral-900">مشاهدات رایگان شما تمام شد</h3>
        <p className="mb-6 text-sm leading-6 text-neutral-600">
          {isAuthenticated
            ? "برای مشاهده شماره تماس آگهی‌های بیشتر، لازم است یکی از پلن‌های اشتراک وامنو را تهیه کنید."
            : "شما به سقف مشاهده رایگان شماره تماس رسیده‌اید. برای ادامه، ابتدا ثبت‌نام یا وارد حساب کاربری خود شوید."}
        </p>

        <div className="w-full space-y-2">
          {isAuthenticated ? (
            <Link href="/subscription" className="block">
              <Button variant="accent" className="w-full">
                <Sparkles size={16} />
                خرید اشتراک
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/register" className="block">
                <Button variant="primary" className="w-full">
                  ثبت‌نام رایگان
                </Button>
              </Link>
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full">
                  ورود به حساب کاربری
                </Button>
              </Link>
            </>
          )}
          <button onClick={onClose} className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-700">
            فعلاً نه، ادامه مرور
          </button>
        </div>
      </div>
    </Modal>
  );
}

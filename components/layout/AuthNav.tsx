"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, ChevronDown, LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function AuthNav() {
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-neutral-100" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            ورود
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button variant="primary" size="sm">
            ثبت‌نام
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <UserIcon size={15} />
        </span>
        <span className="hidden max-w-[100px] truncate sm:inline">{user.full_name || user.phone_number}</span>
        <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow-card-hover animate-fade-in">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <LayoutDashboard size={16} /> پنل کاربری
          </Link>
          <Link
            href="/ads/create"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <PlusCircle size={16} /> ثبت آگهی جدید
          </Link>
          <button
            onClick={async () => {
              setOpen(false);
              await logout();
              router.push("/");
              router.refresh();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> خروج
          </button>
        </div>
      )}
    </div>
  );
}

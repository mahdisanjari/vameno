import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToman(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "-";
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) return "-";
  return new Intl.NumberFormat("fa-IR").format(num) + " تومان";
}

export function formatNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "-";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "-";
  return new Intl.NumberFormat("fa-IR").format(num);
}

export function formatDate(value: string | undefined | null): string {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function toPersianDigits(input: string | number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/[0-9]/g, (d) => persianDigits[Number(d)] ?? d);
}

import type { Metadata } from "next";
import { Vazirmatn, Markazi_Text, Cormorant_Garamond, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** Body, UI, forms and data — the workhorse. */
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap",
});

/** Headings — classical naskh roots, fluid but fully legible at UI sizes. */
const markazi = Markazi_Text({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-markazi",
  display: "swap",
});

/** Latin wordmark and Latin labels only — never Latin paragraphs. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

/**
 * Ceremonial only: the وثیق wordmark and at most one pull-quote per page.
 * Nastaliq's diagonal baseline breaks legibility below ~32px, so it is
 * never used for body copy, buttons, forms, tables or data.
 */
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | خرید و فروش وام`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "وثیق، پلتفرم آگهی خرید و فروش وام در سراسر ایران. آگهی‌های بانک‌های مختلف را بر اساس شهر و نوع وام مقایسه و مشاهده کنید.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${vazirmatn.variable} ${markazi.variable} ${cormorant.variable} ${nastaliq.variable}`;
  return (
    <html lang="fa" dir="rtl" className={fontVars}>
      <body className="flex min-h-screen flex-col font-vazir">
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

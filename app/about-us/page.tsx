import type { Metadata } from "next";
import { ShieldCheck, Users, TrendingUp, Handshake } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card, CardBody } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "آشنایی با وامنو، پلتفرم واسط آگهی خرید و فروش وام در ایران.",
  alternates: { canonical: "/about-us" },
};

const values = [
  {
    icon: ShieldCheck,
    title: "شفافیت",
    desc: "ما همواره به‌روشنی اعلام می‌کنیم که وامنو صرفاً واسط آگهی است، نه ارائه‌دهنده مستقیم خدمات مالی.",
  },
  {
    icon: Users,
    title: "کاربرمحوری",
    desc: "تجربه کاربری ساده و پشتیبانی پاسخگو، محور طراحی تمام بخش‌های وامنو بوده است.",
  },
  {
    icon: TrendingUp,
    title: "رشد مستمر",
    desc: "با افزودن مداوم بانک‌ها، شهرها و امکانات جدید، تلاش می‌کنیم بستری کامل‌تر ارائه دهیم.",
  },
  {
    icon: Handshake,
    title: "اعتماد",
    desc: "با قوانین شفاف و فرآیندهای مشخص، تلاش می‌کنیم فضایی قابل اعتماد برای معاملات وام بسازیم.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="container-page max-w-3xl py-8">
      <Breadcrumbs items={[{ label: "درباره ما" }]} />
      <h1 className="mb-4 text-2xl font-extrabold text-neutral-900">درباره وامنو</h1>

      <div className="space-y-4 text-sm leading-8 text-neutral-600">
        <p>
          وامنو با هدف ساده‌سازی فرآیند خرید و فروش وام در ایران راه‌اندازی شده است. بسیاری از
          افراد به دلیل نیاز مالی، مایل به فروش وام دریافتی خود هستند و در مقابل، افراد بسیاری به
          دنبال خرید وام با شرایط مناسب می‌گردند. وامنو این دو گروه را در بستری منظم، شفاف و قابل
          جستجو کنار هم قرار می‌دهد.
        </p>
        <p>
          پلتفرم ما آگهی‌ها را بر اساس شهر، بانک و نوع وام دسته‌بندی می‌کند تا کاربران بتوانند در
          کوتاه‌ترین زمان ممکن، گزینه مناسب خود را پیدا کنند. تأکید می‌کنیم که وامنو صرفاً یک واسط
          آگهی است و در هیچ مرحله‌ای از معامله مالی میان کاربران دخالتی ندارد؛ مسئولیت نهایی
          معامله بر عهده طرفین آن است.
        </p>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold text-neutral-900">ارزش‌های ما</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {values.map((value) => (
          <Card key={value.title}>
            <CardBody className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <value.icon size={19} />
              </span>
              <div>
                <h3 className="mb-1 font-bold text-neutral-800">{value.title}</h3>
                <p className="text-xs leading-6 text-neutral-500">{value.desc}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

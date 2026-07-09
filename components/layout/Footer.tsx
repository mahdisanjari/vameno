import Link from "next/link";
import { Landmark, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE, SUPPORT_WHATSAPP } from "@/lib/constants";

const footerLinks = [
  {
    title: "دسترسی سریع",
    links: [
      { href: "/", label: "صفحه اصلی" },
      { href: "/subscription", label: "پلن‌های اشتراک" },
      { href: "/ads/create", label: "ثبت آگهی" },
      { href: "/about-us", label: "درباره ما" },
    ],
  },
  {
    title: "قوانین و پشتیبانی",
    links: [
      { href: "/terms", label: "قوانین و مقررات" },
      { href: "/contact-us", label: "تماس با ما" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-navy-950 text-neutral-300">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Landmark size={19} />
            </span>
            <span className="text-lg font-extrabold text-white">وامنو</span>
          </div>
          <p className="max-w-md text-sm leading-7 text-neutral-400">
            وامنو یک پلتفرم واسط برای آگهی خرید و فروش وام است. ما هیچ‌گونه وامی به‌صورت مستقیم ارائه
            نمی‌کنیم و صرفاً بستری برای ارتباط آگهی‌دهندگان و متقاضیان فراهم می‌کنیم. مسئولیت صحت
            اطلاعات آگهی‌ها بر عهده آگهی‌دهنده است. پیش از هرگونه معامله، حتماً بخش{" "}
            <Link href="/terms" className="text-primary-300 underline">
              قوانین و مقررات
            </Link>{" "}
            را مطالعه کنید.
          </p>
        </div>

        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-sm font-bold text-white">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-primary-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">تماس با پشتیبانی</h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-primary-400" />
              <a href={`tel:${SUPPORT_PHONE}`} dir="ltr">
                {SUPPORT_PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={15} className="text-primary-400" />
              <a href={`https://wa.me/${SUPPORT_WHATSAPP}`} target="_blank" rel="noopener noreferrer">
                پیام واتساپ
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-primary-400" />
              <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr">
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} className="text-primary-400" />
              {SUPPORT_HOURS}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="container-page text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} وامنو — تمامی حقوق محفوظ است. وامنو صرفاً واسط آگهی است و
          ارائه‌دهنده مستقیم خدمات بانکی نیست.
        </p>
      </div>
    </footer>
  );
}

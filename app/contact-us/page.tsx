import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card, CardBody } from "@/components/ui/card";
import { SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE, SUPPORT_WHATSAPP } from "@/lib/constants";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های ارتباط با تیم پشتیبانی وامنو؛ فرم تماس، شماره پشتیبانی و ساعات پاسخگویی.",
  alternates: { canonical: "/contact-us" },
};

const contactItems = [
  { icon: Phone, label: "تلفن پشتیبانی", value: SUPPORT_PHONE, href: `tel:${SUPPORT_PHONE}`, dir: "ltr" as const },
  {
    icon: MessageCircle,
    label: "واتساپ",
    value: "ارسال پیام در واتساپ",
    href: `https://wa.me/${SUPPORT_WHATSAPP}`,
  },
  { icon: Mail, label: "ایمیل", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}`, dir: "ltr" as const },
  { icon: Clock, label: "ساعات پاسخگویی", value: SUPPORT_HOURS },
  { icon: MapPin, label: "دفتر مرکزی", value: "تهران، خیابان ولیعصر، برج وامنو، طبقه ۴" },
];

export default function ContactUsPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "تماس با ما" }]} />
      <h1 className="mb-2 text-2xl font-extrabold text-neutral-900">تماس با ما</h1>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-neutral-600">
        سوال، پیشنهاد یا مشکلی دارید؟ تیم پشتیبانی وامنو آماده پاسخگویی به شماست. فرم زیر را پر
        کنید یا از راه‌های ارتباطی دیگر با ما در تماس باشید.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ContactForm />

        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                    <item.icon size={16} />
                  </span>
                  <div>
                    <p className="text-xs text-neutral-500">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" dir={item.dir} className="text-sm font-medium text-neutral-800 hover:text-primary-700">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-neutral-800">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "ثبت‌نام",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="container-page flex max-w-md flex-col items-center py-16">
      <div className="w-full">
        <h1 className="mb-1 text-center text-2xl font-extrabold text-neutral-900">ثبت‌نام در وامنو</h1>
        <p className="mb-8 text-center text-sm text-neutral-500">
          برای ثبت آگهی و مشاهده شماره تماس، حساب کاربری بسازید.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}

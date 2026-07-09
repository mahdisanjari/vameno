import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="container-page flex max-w-md flex-col items-center py-16">
      <div className="w-full">
        <h1 className="mb-1 text-center text-2xl font-extrabold text-neutral-900">ورود به وامنو</h1>
        <p className="mb-8 text-center text-sm text-neutral-500">
          با شماره موبایل و رمز عبور خود وارد شوید.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

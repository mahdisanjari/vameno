"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  phone_number: z.string().regex(/^0?9\d{9}$/, "شماره موبایل معتبر نیست"),
  password: z.string().min(6, "رمز عبور را وارد کنید"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setLoading(true);
    const result = await login(values.phone_number, values.password);
    setLoading(false);

    if (!result.ok) {
      setServerError(result.error ?? "ورود ناموفق بود");
      return;
    }

    const next = searchParams.get("next") || "/dashboard";
    router.push(next);
    router.refresh();
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="phone_number">شماره موبایل</Label>
            <Input id="phone_number" dir="ltr" placeholder="09xxxxxxxxx" {...register("phone_number")} />
            {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">رمز عبور</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            ورود
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          حساب کاربری ندارید؟{" "}
          <Link href="/auth/register" className="font-medium text-primary-700 hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const schema = z
  .object({
    full_name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
    phone_number: z.string().regex(/^0?9\d{9}$/, "شماره موبایل معتبر نیست"),
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "تکرار رمز عبور مطابقت ندارد",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
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
    const result = await registerUser({
      full_name: values.full_name,
      phone_number: values.phone_number,
      password: values.password,
      password_confirm: values.confirm_password,
    });
    setLoading(false);

    if (!result.ok) {
      setServerError(result.error ?? "ثبت‌نام ناموفق بود");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="full_name">نام و نام خانوادگی</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>}
          </div>
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
          <div>
            <Label htmlFor="confirm_password">تکرار رمز عبور</Label>
            <Input id="confirm_password" type="password" {...register("confirm_password")} />
            {errors.confirm_password && <p className="mt-1 text-xs text-red-600">{errors.confirm_password.message}</p>}
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            ثبت‌نام
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/auth/login" className="font-medium text-primary-700 hover:underline">
            وارد شوید
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}

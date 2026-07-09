"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { Bank, City, Loan } from "@/lib/types";

const schema = z.object({
  title: z.string().min(5, "عنوان باید حداقل ۵ حرف باشد").max(255),
  ad_type: z.enum(["buy", "sell"]),
  city: z.string().min(1, "شهر را انتخاب کنید"),
  bank: z.string().optional(),
  loan_type: z.string().optional(),
  amount: z
    .string()
    .min(1, "مبلغ را وارد کنید")
    .regex(/^\d+$/, "مبلغ باید فقط عدد باشد"),
  phone_number: z
    .string()
    .min(1, "شماره تماس را وارد کنید")
    .max(11)
    .regex(/^0?9\d{9}$/, "شماره موبایل معتبر نیست"),
  description: z.string().min(1, "توضیحات را وارد کنید").max(2000),
});

type FormValues = z.infer<typeof schema>;

export function CreateAdForm({ cities, banks, loans }: { cities: City[]; banks: Bank[]; loans: Loan[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ad_type: "sell" },
  });

  const visibleLoans = useMemo(
    () => (selectedBank ? loans.filter((l) => l.bank.id === selectedBank) : loans),
    [loans, selectedBank],
  );

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/ads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          ad_type: values.ad_type,
          city: values.city,
          amount: Number(values.amount),
          phone_number: values.phone_number,
          description: values.description,
          bank: values.bank || undefined,
          loan_type: values.loan_type || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const firstError =
          typeof data === "object" && data !== null
            ? Object.values(data).flat().find((v) => typeof v === "string")
            : undefined;
        showToast(data.detail ?? firstError ?? "ثبت آگهی ناموفق بود، دوباره تلاش کنید", "error");
        return;
      }

      const data = await res.json();
      showToast("آگهی شما با موفقیت ثبت شد", "success");
      router.push(data.id ? `/ads/${data.id}` : "/dashboard");
    } catch {
      showToast("ارتباط با سرور برقرار نشد", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>نوع آگهی</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" value="sell" {...register("ad_type")} defaultChecked />
                فروش وام
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" value="buy" {...register("ad_type")} />
                خرید وام (متقاضی هستم)
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="title">عنوان آگهی</Label>
            <Input id="title" placeholder="مثال: فروش وام خودرو بانک ملی" {...register("title")} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">شهر</Label>
              <Select id="city" {...register("city")}>
                <option value="">انتخاب کنید</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
            </div>
            <div>
              <Label htmlFor="amount">مبلغ (تومان)</Label>
              <Input id="amount" inputMode="numeric" placeholder="مثال: 50000000" {...register("amount")} />
              {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bank">بانک (اختیاری)</Label>
              <Select
                id="bank"
                value={selectedBank}
                onChange={(e) => {
                  setSelectedBank(e.target.value);
                  setValue("bank", e.target.value);
                  setValue("loan_type", "");
                }}
              >
                <option value="">بدون انتخاب</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="loan_type">نوع وام (اختیاری)</Label>
              <Select id="loan_type" {...register("loan_type")}>
                <option value="">بدون انتخاب</option>
                {visibleLoans.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="phone_number">شماره تماس</Label>
            <Input id="phone_number" dir="ltr" placeholder="09xxxxxxxxx" {...register("phone_number")} />
            {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">توضیحات</Label>
            <Textarea id="description" rows={5} placeholder="توضیحات تکمیلی درباره آگهی..." {...register("description")} />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            ثبت آگهی
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

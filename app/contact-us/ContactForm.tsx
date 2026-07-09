"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

const schema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  phone: z.string().regex(/^0?9\d{9}$/, "شماره موبایل معتبر نیست"),
  subject: z.string().min(3, "موضوع باید حداقل ۳ حرف باشد"),
  message: z.string().min(10, "پیام باید حداقل ۱۰ حرف باشد"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        showToast("ارسال پیام ناموفق بود، دوباره تلاش کنید", "error");
        return;
      }

      showToast("پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.", "success");
      reset();
    } catch {
      showToast("ارتباط با سرور برقرار نشد", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">شماره تماس</Label>
              <Input id="phone" dir="ltr" placeholder="09xxxxxxxxx" {...register("phone")} />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="subject">موضوع</Label>
            <Input id="subject" {...register("subject")} />
            {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
          </div>
          <div>
            <Label htmlFor="message">پیام شما</Label>
            <Textarea id="message" rows={6} {...register("message")} />
            {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            ارسال پیام
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

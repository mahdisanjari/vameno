"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/lib/types";

const profileSchema = z.object({
  full_name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
});

const passwordSchema = z
  .object({
    old_password: z.string().min(6, "رمز عبور فعلی را وارد کنید"),
    new_password: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "تکرار رمز عبور مطابقت ندارد",
    path: ["confirm_password"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export function ProfileForm({ user }: { user: User }) {
  const { showToast } = useToast();
  const { refresh } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: user.full_name },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  async function onProfileSubmit(values: ProfileValues) {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        showToast("بروزرسانی پروفایل ناموفق بود", "error");
        return;
      }
      await refresh();
      showToast("پروفایل با موفقیت بروزرسانی شد", "success");
    } finally {
      setSavingProfile(false);
    }
  }

  async function onPasswordSubmit(values: PasswordValues) {
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_password: values.old_password,
          new_password: values.new_password,
          new_password_confirm: values.confirm_password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.detail ?? "تغییر رمز عبور ناموفق بود", "error");
        return;
      }
      showToast("رمز عبور با موفقیت تغییر کرد", "success");
      passwordForm.reset();
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <h2 className="mb-4 text-sm font-bold text-neutral-800">اطلاعات حساب کاربری</h2>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <Label>شماره موبایل</Label>
              <Input value={user.phone_number} disabled dir="ltr" />
            </div>
            <div>
              <Label htmlFor="full_name">نام و نام خانوادگی</Label>
              <Input id="full_name" {...profileForm.register("full_name")} />
              {profileForm.formState.errors.full_name && (
                <p className="mt-1 text-xs text-red-600">{profileForm.formState.errors.full_name.message}</p>
              )}
            </div>
            <Button type="submit" disabled={savingProfile}>
              ذخیره تغییرات
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="mb-4 text-sm font-bold text-neutral-800">تغییر رمز عبور</h2>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="old_password">رمز عبور فعلی</Label>
              <Input id="old_password" type="password" {...passwordForm.register("old_password")} />
              {passwordForm.formState.errors.old_password && (
                <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.old_password.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="new_password">رمز عبور جدید</Label>
              <Input id="new_password" type="password" {...passwordForm.register("new_password")} />
              {passwordForm.formState.errors.new_password && (
                <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.new_password.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirm_password">تکرار رمز عبور جدید</Label>
              <Input id="confirm_password" type="password" {...passwordForm.register("confirm_password")} />
              {passwordForm.formState.errors.confirm_password && (
                <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.confirm_password.message}</p>
              )}
            </div>
            <Button type="submit" variant="outline" disabled={savingPassword}>
              تغییر رمز عبور
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

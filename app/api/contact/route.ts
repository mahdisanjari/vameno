import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد").max(100),
  phone: z
    .string()
    .regex(/^0?9\d{9}$/, "شماره موبایل معتبر نیست"),
  subject: z.string().min(3, "موضوع باید حداقل ۳ حرف باشد").max(150),
  message: z.string().min(10, "پیام باید حداقل ۱۰ حرف باشد").max(2000),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // TODO: connect to Django /api/contact/ once backend endpoint is ready.
  // For now we log the submission server-side so nothing is silently dropped.
  console.log("[contact-form submission]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

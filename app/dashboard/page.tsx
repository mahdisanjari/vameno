import type { Metadata } from "next";
import { DashboardTabs } from "./DashboardTabs";

export const metadata: Metadata = {
  title: "پنل کاربری",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-neutral-900">پنل کاربری</h1>
      <DashboardTabs />
    </div>
  );
}

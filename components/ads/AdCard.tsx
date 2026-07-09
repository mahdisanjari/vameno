import Link from "next/link";
import { MapPin, Landmark, CalendarDays, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhoneRevealButton } from "./PhoneRevealButton";
import { formatDate, formatToman } from "@/lib/utils";
import type { Ad } from "@/lib/types";

export function AdCard({ ad }: { ad: Ad }) {
  const isBuy = ad.ad_type === "buy";

  return (
    <Card className="group flex flex-col hover:shadow-card-hover">
      <CardBody className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant={isBuy ? "primary" : "accent"}>
            {isBuy ? <ArrowDownCircle size={13} className="ml-1 inline" /> : <ArrowUpCircle size={13} className="ml-1 inline" />}
            {ad.ad_type_display ?? (isBuy ? "متقاضی خرید وام" : "فروش وام")}
          </Badge>
          {ad.loan_type_name && <Badge variant="neutral">{ad.loan_type_name}</Badge>}
        </div>

        <Link href={`/ads/${ad.id}`} className="line-clamp-2 text-base font-bold text-neutral-900 hover:text-primary-700">
          {ad.title}
        </Link>

        <p className="text-xl font-extrabold text-primary-700">{formatToman(ad.amount)}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {ad.city_name}
          </span>
          {ad.bank_name && (
            <span className="flex items-center gap-1">
              <Landmark size={13} />
              {ad.bank_name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays size={13} />
            {formatDate(ad.created_at)}
          </span>
        </div>

        <div className="mt-auto pt-2">
          <PhoneRevealButton adId={ad.id} />
        </div>
      </CardBody>
    </Card>
  );
}

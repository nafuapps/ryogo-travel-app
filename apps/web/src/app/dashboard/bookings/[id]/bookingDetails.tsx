"use client";

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services";
import { useTranslations } from "next-intl";

export default function BookingDetailsPageComponent({
  booking,
  isOwner,
}: {
  booking: FindBookingDetailsByIdType;
  isOwner?: boolean;
}) {
  const t = useTranslations("Dashboard.BookingDetails");

  return <div></div>;
}

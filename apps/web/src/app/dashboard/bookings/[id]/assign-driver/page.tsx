//Bookings/id/assign-driver page (for a lead/confirmed booking)

import { useTranslations } from "next-intl";

export default function AssignDriverBookingPage() {
  const t = useTranslations("Landing");
  return <h1>{t("title")}</h1>;
}

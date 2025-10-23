//Bookings/id/assign-user page (only for owner)

import { useTranslations } from "next-intl";

export default function AssignUserBookingPage() {
  const t = useTranslations("Landing");
  return <h1>{t("title")}</h1>;
}

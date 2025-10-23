//Bookings/id/assign-vehicle page (for a lead/confirmed booking)

import { useTranslations } from "next-intl";

export default function AssignVehicleBookingPage() {
  const t = useTranslations("Landing");
  return <h1>{t("title")}</h1>;
}

//MyBooking[id] page

import { getTranslations } from "next-intl/server";

export default async function MyBookingPage() {
  const t = await getTranslations("Rider.MyBookings");
  return <h1>{t("Title")}</h1>;
}

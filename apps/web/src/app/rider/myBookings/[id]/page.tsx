//MyBooking[id] page

import { getTranslations } from "next-intl/server";

export default async function MyBookingPage() {
  const t = await getTranslations("Landing");
  return <h1>{t("title")}</h1>;
}

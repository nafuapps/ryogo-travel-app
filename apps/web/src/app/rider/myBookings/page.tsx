//MyBookings page

import { getTranslations } from "next-intl/server";

export default async function MyBookingsPage() {
  const t = await getTranslations("Landing");
  return <h1>{t("title")}</h1>;
}

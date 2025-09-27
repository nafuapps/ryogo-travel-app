//Dashboard home page

import { getTranslations } from "next-intl/server";

export default async function DashboardHomePage() {
  const t = await getTranslations("Landing");
  return <h1>{t("title")}</h1>;
}

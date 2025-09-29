//MyVehicle home page

import { getTranslations } from "next-intl/server";

export default async function MyVehiclePage() {
  const t = await getTranslations("Landing");
  return <h1>{t("title")}</h1>;
}

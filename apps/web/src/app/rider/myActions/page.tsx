//MyVehicle home page

import { getTranslations } from "next-intl/server";

export default async function MyActionsPage() {
  const t = await getTranslations("Rider");
  return <h1>{t("title")}</h1>;
}

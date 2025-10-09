//MyVehicle home page

import { getTranslations } from "next-intl/server";

export default async function MyVehiclePage() {
  const t = await getTranslations("Rider.MyVehicle");
  return <h1>{t("Title")}</h1>;
}

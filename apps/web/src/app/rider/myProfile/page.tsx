//MyProfile page

import { getTranslations } from "next-intl/server";

export default async function MyProfilePage() {
  const t = await getTranslations("Landing");
  return <h1>{t("title")}</h1>;
}

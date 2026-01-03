//Search page

import { useTranslations } from "next-intl"

export default function SearchPage() {
  const t = useTranslations("Landing")
  return <h1>{t("title")}</h1>
}

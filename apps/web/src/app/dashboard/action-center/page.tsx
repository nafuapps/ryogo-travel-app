//Action_center page

import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { useTranslations } from "next-intl"

export const metadata: Metadata = {
  title: `Action Center - ${pageTitle}`,
  description: pageDescription,
}

export default function ActionCenterPage() {
  const t = useTranslations("Dashboard")
  return <h1></h1>
}

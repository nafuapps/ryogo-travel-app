//Analytics page (only accessible by owner)

import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { useTranslations } from "next-intl"

export const metadata: Metadata = {
  title: `Analytics - ${pageTitle}`,
  description: pageDescription,
}

export default function AnalyticsPage() {
  const t = useTranslations("Dashboard")
  return <h1></h1>
}

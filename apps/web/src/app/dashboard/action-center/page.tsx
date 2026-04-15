//Action_center page

import { Metadata } from "next"
import { useTranslations } from "next-intl"

export const metadata: Metadata = {
  title: "Action Center - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default function ActionCenterPage() {
  const t = useTranslations("Dashboard")
  return <h1></h1>
}

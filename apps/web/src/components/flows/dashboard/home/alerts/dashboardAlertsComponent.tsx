import { SectionWrapper } from "@/components/page/pageWrappers"
import { getTranslations } from "next-intl/server"
import { DashboardSectionHeader } from "@/components/flows/dashboard/dashboardCommon"

export default async function DashboardAlertsComponent({
  agencyId,
  userId,
}: {
  agencyId: string
  userId: string
}) {
  const t = await getTranslations("Dashboard.Home.Alerts")

  return (
    <SectionWrapper id="DashboardAlerts">
      <DashboardSectionHeader title={t("Title")} />
    </SectionWrapper>
  )
}

import { SectionWrapper } from "@/components/page/pageWrappers"
import { getTranslations } from "next-intl/server"
import { DashboardSectionHeader } from "@/components/flows/dashboard/dashboardCommon"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"

export default async function DashboardAlertsComponent({
  userId,
}: {
  userId: string
}) {
  const t = await getTranslations("Dashboard.Home.Alerts")
  // const alerts = await missionServices.findDashboardMissionsByUserId(userId)

  return (
    <SectionWrapper id="DashboardAlerts">
      <DashboardSectionHeader title={t("Title")} />
    </SectionWrapper>
  )
}

import { SectionWrapper } from "@/components/page/pageWrappers"
import { DashboardSectionHeader } from "@/components/flows/dashboard/dashboardCommon"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { getTranslations } from "next-intl/server"

export default async function DashboardActivityComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.Activity")
  // const feeds = await notificationServices.findDashboardActivity(agencyId)

  return (
    <SectionWrapper id="DashboardActivity">
      <DashboardSectionHeader title={t("Title")} />
    </SectionWrapper>
  )
}

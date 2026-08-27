import { SectionWrapper } from "@/components/page/pageWrappers"
import { getTranslations } from "next-intl/server"
import { DashboardSectionHeader } from "@/components/flows/dashboard/dashboardCommon"

export default async function DashboardPendingPaymentsComponent({
  agencyId,
  userId,
  isOwner,
}: {
  agencyId: string
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Home.PendingPayments")

  return (
    <SectionWrapper id="DashboardPendingPayments">
      <DashboardSectionHeader title={t("Title")} />
    </SectionWrapper>
  )
}

import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { RyogoCaption } from "@/components/typography"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import DashboardLeadItemComponent from "./dashboardLeadItemComponent"

export default async function DashboardLeadsComponent({
  agencyId,
  userId,
  isOwner,
}: {
  agencyId: string
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Home.Leads")

  let dashboardLeads = await bookingServices.findDashboardLeads(agencyId)
  if (!isOwner) {
    dashboardLeads = dashboardLeads.filter(
      (trip) => trip.assignedUser.id === userId,
    )
  }

  return (
    <SectionWrapper id="DashboardLeads">
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Title")}</RyogoCaption>
        <RyogoCaption color="light">{dashboardLeads.length}</RyogoCaption>
      </SectionRowWrapper>
      {dashboardLeads.map((trip, index) => (
        <DashboardLeadItemComponent
          key={index}
          trip={trip}
          userId={userId}
          isOwner={isOwner}
        />
      ))}
    </SectionWrapper>
  )
}

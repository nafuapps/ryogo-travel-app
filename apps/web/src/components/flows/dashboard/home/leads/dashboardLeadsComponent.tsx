import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { RyogoCaption } from "@/components/typography"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import DashboardLeadItemComponent from "./dashboardLeadItemComponent"
import { addDays } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { DashboardSectionHeader } from "@/components/flows/dashboard/dashboardCommon"

const days = 7

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

  let dashboardLeads = await bookingServices.findDashboardLeads(agencyId, days)

  if (!isOwner) {
    dashboardLeads = dashboardLeads.filter(
      (trip) => trip.assignedUser.id === userId,
    )
  }

  const startingThisWeek = dashboardLeads.filter(
    (lead) => lead.startDate <= addDays(new Date(), days),
  )

  const createdThisWeek = dashboardLeads.filter(
    (lead) => lead.startDate > addDays(new Date(), days),
  )

  return (
    <SectionWrapper id="DashboardLeads">
      <DashboardSectionHeader title={t("Title")} />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("StartingThisWeek")}</RyogoCaption>
        <RyogoCaption color="light">{startingThisWeek.length}</RyogoCaption>
      </SectionRowWrapper>
      {startingThisWeek.map((trip, index) => (
        <DashboardLeadItemComponent
          key={index}
          trip={trip}
          userId={userId}
          isOwner={isOwner}
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("CreatedThisWeek")}</RyogoCaption>
        <RyogoCaption color="light">{createdThisWeek.length}</RyogoCaption>
      </SectionRowWrapper>
      {createdThisWeek.map((trip, index) => (
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

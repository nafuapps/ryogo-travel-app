import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { SectionWrapper } from "@/components/page/pageWrappers"
import DashboardLeadItemComponent from "./dashboardLeadItemComponent"
import { addDays } from "date-fns"
import {
  DashboardRowHeader,
  DashboardRow,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"

const DASHBOARD_LEAD_DAYS = 7

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

  let dashboardLeads = await bookingServices.findDashboardLeads(
    agencyId,
    DASHBOARD_LEAD_DAYS,
  )

  if (!isOwner) {
    dashboardLeads = dashboardLeads.filter(
      (trip) => trip.assignedUser.id === userId,
    )
  }
  if (dashboardLeads.length === 0) {
    return null
  }

  const filterDate = addDays(new Date(), DASHBOARD_LEAD_DAYS)

  const startingThisWeek = dashboardLeads.filter(
    (lead) => lead.startDate <= filterDate,
  )

  const createdThisWeek = dashboardLeads.filter(
    (lead) => lead.startDate > filterDate,
  )

  return (
    <SectionWrapper id="DashboardLeads">
      <DashboardSectionHeader
        title={t("Title")}
        href={"/dashboard/bookings/leads"}
      />
      {startingThisWeek.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("StartingThisWeek")}
            count={startingThisWeek.length}
          />
          {startingThisWeek.map((trip) => (
            <DashboardLeadItemComponent
              key={trip.id}
              trip={trip}
              userId={userId}
              isOwner={isOwner}
            />
          ))}
        </DashboardRow>
      )}
      {createdThisWeek.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("CreatedThisWeek")}
            count={createdThisWeek.length}
          />
          {createdThisWeek.map((trip) => (
            <DashboardLeadItemComponent
              key={trip.id}
              trip={trip}
              userId={userId}
              isOwner={isOwner}
            />
          ))}
        </DashboardRow>
      )}
    </SectionWrapper>
  )
}

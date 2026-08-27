import { RyogoCaption, RyogoH4 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Separator } from "@/components/ui/separator"
import DashboardTripItemComponent from "./dashboardTripItemComponent"
import { DashboardSectionHeader } from "@/components/flows/dashboard/dashboardCommon"

// Trips (starting today, ending today, ongoing)

export default async function DashboardTripsComponent({
  agencyId,
  userId,
  isOwner,
}: {
  agencyId: string
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Home.Trips")

  let dashboardTrips = await bookingServices.findDashboardTrips(agencyId)
  if (!isOwner) {
    dashboardTrips = dashboardTrips.filter(
      (trip) => trip.assignedUser.id === userId,
    )
  }

  const startingTodayTrips = dashboardTrips.filter(
    (trip) => trip.status === BookingStatusEnum.CONFIRMED,
  )
  const endingTodayTrips = dashboardTrips.filter(
    (trip) =>
      trip.status === BookingStatusEnum.IN_PROGRESS &&
      trip.endDate <= new Date(),
  )

  const ongoingTrips = dashboardTrips.filter(
    (trip) =>
      trip.status === BookingStatusEnum.IN_PROGRESS &&
      trip.endDate > new Date(),
  )

  return (
    <SectionWrapper id="DashboardTrips">
      <DashboardSectionHeader title={t("Title")} />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("StartingToday")}</RyogoCaption>
        <RyogoCaption color="light">{startingTodayTrips.length}</RyogoCaption>
      </SectionRowWrapper>
      {startingTodayTrips.map((trip, index) => (
        <DashboardTripItemComponent
          key={index}
          trip={trip}
          userId={userId}
          isOwner={isOwner}
          type="starting"
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("EndingToday")}</RyogoCaption>
        <RyogoCaption color="light">{endingTodayTrips.length}</RyogoCaption>
      </SectionRowWrapper>
      {endingTodayTrips.map((trip, index) => (
        <DashboardTripItemComponent
          key={index}
          trip={trip}
          userId={userId}
          isOwner={isOwner}
          type="ending"
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Ongoing")}</RyogoCaption>
        <RyogoCaption color="light">{ongoingTrips.length}</RyogoCaption>
      </SectionRowWrapper>
      {ongoingTrips.map((trip, index) => (
        <DashboardTripItemComponent
          key={index}
          trip={trip}
          userId={userId}
          isOwner={isOwner}
          type="ongoing"
        />
      ))}
    </SectionWrapper>
  )
}

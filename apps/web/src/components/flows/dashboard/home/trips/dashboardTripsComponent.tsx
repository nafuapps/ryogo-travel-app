import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import DashboardTripItemComponent from "./dashboardTripItemComponent"
import {
  DashboardRow,
  DashboardRowHeader,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"

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

  if (dashboardTrips.length === 0) {
    return null
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
      <DashboardSectionHeader title={t("Title")} href={"/dashboard/bookings"} />
      {startingTodayTrips.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("StartingToday")}
            count={startingTodayTrips.length}
          />
          {startingTodayTrips.map((trip, index) => (
            <DashboardTripItemComponent
              key={index}
              trip={trip}
              userId={userId}
              isOwner={isOwner}
              type="starting"
            />
          ))}
        </DashboardRow>
      )}
      {endingTodayTrips.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("EndingToday")}
            count={endingTodayTrips.length}
          />
          {endingTodayTrips.map((trip, index) => (
            <DashboardTripItemComponent
              key={index}
              trip={trip}
              userId={userId}
              isOwner={isOwner}
              type="ending"
            />
          ))}
        </DashboardRow>
      )}
      {ongoingTrips.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("Ongoing")}
            count={ongoingTrips.length}
          />
          {ongoingTrips.map((trip, index) => (
            <DashboardTripItemComponent
              key={index}
              trip={trip}
              userId={userId}
              isOwner={isOwner}
              type="ongoing"
            />
          ))}
        </DashboardRow>
      )}
    </SectionWrapper>
  )
}

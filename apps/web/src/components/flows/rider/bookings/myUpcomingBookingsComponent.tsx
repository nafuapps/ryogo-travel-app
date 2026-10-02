import { Clock, TicketX, Waypoints } from "lucide-react"
import {
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { getTranslations } from "next-intl/server"
import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import {
  BookingStatusEnum,
  DriverStatusEnum,
} from "@ryogo-travel-app/db/schema"

export default async function MyUpcomingBookingsComponent({
  assignedBookings,
  driverStatus,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  driverStatus: DriverStatusEnum
}) {
  const t = await getTranslations("Rider.MyBookings")

  const upcomingBookings = assignedBookings.filter(
    (booking) => booking.status === BookingStatusEnum.CONFIRMED,
  )

  const ongoingBooking = assignedBookings.find(
    (booking) => booking.status === BookingStatusEnum.IN_PROGRESS,
  )

  return (
    <>
      {ongoingBooking && (
        <SectionWrapper id="OngoingBookingsSection">
          <SectionHeaderWrapper icon={Waypoints} label={t("Ongoing.Title")} />
          <OngoingBookingCard
            booking={ongoingBooking}
            startLabel={t("Ongoing.Continue")}
            rider
          />
        </SectionWrapper>
      )}
      <SectionWrapper id="UpcomingBookingsSection">
        <SectionHeaderWrapper
          icon={Clock}
          label={t("Upcoming.Title")}
          count={upcomingBookings.length}
        />
        {upcomingBookings.length > 0 ? (
          <TileGridWrapper>
            {upcomingBookings.map((trip) => (
              <UpcomingBookingCard
                key={trip.id}
                booking={trip}
                rider
                canStart={
                  !ongoingBooking &&
                  trip.assignedVehicle !== null &&
                  trip.startDate <= new Date() &&
                  driverStatus === DriverStatusEnum.AVAILABLE
                }
                startLabel={t("Upcoming.Start")}
              />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={TicketX} label={t("Upcoming.NoTrips")} />
        )}
      </SectionWrapper>
    </>
  )
}

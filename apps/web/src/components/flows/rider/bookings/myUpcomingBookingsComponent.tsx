import { Clock, TicketX } from "lucide-react"
import {
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { UpcomingBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { getTranslations } from "next-intl/server"
import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function MyUpcomingBookingsComponent({
  upcomingBookings,
  driverStatus,
}: {
  upcomingBookings: FindDriverAssignedBookingsByIdType
  driverStatus: DriverStatusEnum
}) {
  const t = await getTranslations("Rider.MyBookings.Upcoming")

  return (
    <SectionWrapper id="UpcomingBookingsSection">
      <SectionHeaderWrapper
        icon={Clock}
        label={t("Title")}
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
                trip.assignedVehicle !== null &&
                trip.startDate <= new Date() &&
                driverStatus === DriverStatusEnum.AVAILABLE
              }
              startLabel={t("Start")}
            />
          ))}
        </TileGridWrapper>
      ) : (
        <EmptyStateIcon icon={TicketX} label={t("NoTrips")} />
      )}
    </SectionWrapper>
  )
}

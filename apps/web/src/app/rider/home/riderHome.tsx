import {
  FindDriverAssignedBookingsByIdType,
  FindDriverByUserIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { RyogoSmall } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  BookingStatusEnum,
  DriverStatusEnum,
} from "@ryogo-travel-app/db/schema"
import {
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"

//TODO: Revamp home page for rider with a floating ongoing booking nudge
//TODO: Get leaves and let driver start/end leave

export default async function RiderHomePageComponent({
  assignedBookings,
  driver,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  driver: NonNullable<FindDriverByUserIdType>
}) {
  const t = await getTranslations("Rider.Home")
  //Get in progress booking (if any)
  const currentBooking = assignedBookings.find(
    (booking) => booking.status === BookingStatusEnum.IN_PROGRESS,
  )
  //Get upcoming bookings which can be started
  const upcomingBookings = assignedBookings
    .filter(
      (booking) =>
        booking.status === BookingStatusEnum.CONFIRMED &&
        booking.startDate <= new Date() &&
        booking.assignedVehicle !== null,
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 3)

  return (
    <PageWrapper id="RiderHomePage">
      {upcomingBookings.length > 0 && (
        <>
          <RyogoSmall>{t("Upcoming")}</RyogoSmall>
          {upcomingBookings.map((b, i) => {
            return (
              <UpcomingBookingCard
                key={b.id}
                booking={b}
                rider
                canStart={
                  driver.status === DriverStatusEnum.AVAILABLE &&
                  !currentBooking &&
                  b.startDate <= new Date() &&
                  i === 0
                }
                startLabel={t("Start")}
              />
            )
          })}
        </>
      )}
      <StickyActionWrapper>
        {currentBooking && (
          <OngoingBookingCard
            booking={currentBooking}
            rider
            startLabel={t("Continue")}
          />
        )}
      </StickyActionWrapper>
    </PageWrapper>
  )
}

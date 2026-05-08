import { RyogoSmall } from "@/components/typography"
import {
  FindDriverAssignedBookingsByIdType,
  FindDriverByUserIdType,
  FindDriverCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import {
  CompletedBookingCard,
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/cards/booking/bookingCards"

export default async function RiderMyBookingsPageComponent({
  assignedBookings,
  completedBookings,
  driver,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  completedBookings: FindDriverCompletedBookingsByIdType
  driver: NonNullable<FindDriverByUserIdType>
}) {
  const t = await getTranslations("Rider.MyBookings")
  //Get in progress booking (if any)
  const currentBooking = assignedBookings.find((booking) => booking.status)
  //Get atmost 3 upcoming bookings
  const upcomingBookings = assignedBookings
    .filter((booking) => !booking.status)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, 3)

  return (
    <PageWrapper id="RiderMyBookingsPage">
      {currentBooking && (
        <SectionWrapper id="RiderOngoingBooking">
          <RyogoSmall>{t("Ongoing")}</RyogoSmall>
          <OngoingBookingCard
            booking={currentBooking}
            rider
            startLabel={t("Continue")}
          />
        </SectionWrapper>
      )}
      {upcomingBookings.length > 0 && (
        <SectionWrapper id="RiderUpcomingBookings">
          <RyogoSmall>{t("Upcoming")}</RyogoSmall>
          {upcomingBookings.map((b, i) => {
            return (
              <UpcomingBookingCard
                key={b.bookingId}
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
        </SectionWrapper>
      )}
      {completedBookings.length > 0 && (
        <SectionWrapper id="RiderCompletedBookings">
          <RyogoSmall>{t("Completed")}</RyogoSmall>
          {completedBookings.map((b) => {
            return <CompletedBookingCard key={b.bookingId} booking={b} rider />
          })}
        </SectionWrapper>
      )}
    </PageWrapper>
  )
}

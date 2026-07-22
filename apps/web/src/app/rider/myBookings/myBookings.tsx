import { RyogoCaption } from "@/components/typography"
import {
  FindDriverAssignedBookingsByIdType,
  FindDriverByUserIdType,
  FindDriverCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  CompletedBookingCard,
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/cards/booking/bookingCards"
import { Separator } from "@/components/ui/separator"
import { PageWrapper } from "@/components/page/pageWrappers"

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
  //Get atmost 3 upcoming bookings (which have no trip log yet)
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
        <>
          <RyogoCaption color="light">{t("Ongoing")}</RyogoCaption>
          <OngoingBookingCard
            booking={currentBooking}
            rider
            startLabel={t("Continue")}
          />
        </>
      )}
      {upcomingBookings.length > 0 && (
        <>
          <Separator />
          <RyogoCaption color="light">{t("Upcoming")}</RyogoCaption>
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
        </>
      )}
      {completedBookings.length > 0 && (
        <>
          <Separator />
          <RyogoCaption color="light">{t("Completed")}</RyogoCaption>
          {completedBookings.map((b) => {
            return <CompletedBookingCard key={b.bookingId} booking={b} rider />
          })}
        </>
      )}
    </PageWrapper>
  )
}

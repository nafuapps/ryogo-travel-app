import {
  FindDriverAssignedBookingsByIdType,
  FindDriverByUserIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { RyogoSmall } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { PageWrapper } from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/cards/booking/bookingCards"

/**
 * TODO: Show important actions
 */

export default async function RiderHomePageComponent({
  assignedBookings,
  driver,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  driver: NonNullable<FindDriverByUserIdType>
}) {
  const t = await getTranslations("Rider.Home")
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
    <PageWrapper id="RiderHomePage">
      {assignedBookings.length === 0 ? (
        <div className="flex flex-col items-center">
          <RyogoSmall color="slate">{t("NoBooking")}</RyogoSmall>
        </div>
      ) : (
        <>
          {currentBooking && (
            <OngoingBookingCard
              booking={currentBooking}
              rider
              startLabel={t("Continue")}
            />
          )}
          {upcomingBookings.length > 0 && (
            <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-lg p-3 lg:p-4">
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
            </div>
          )}
        </>
      )}
    </PageWrapper>
  )
}

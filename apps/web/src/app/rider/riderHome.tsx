import {
  FindDriverAssignedBookingsByIdType,
  FindDriverByUserIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { pageClassName } from "@/components/page/pageCommons"
import { Small, SmallGrey } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  OngoingBookingComponent,
  UpcomingBookingComponent,
} from "./components/myBookingCommon"

/**
 * TODO: Show important actions
 */

export default async function RiderHomePageComponent({
  assignedBookings,
  driver,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  driver: FindDriverByUserIdType
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
    <div id="RiderHomePage" className={pageClassName}>
      {assignedBookings.length == 0 ? (
        <div className="flex flex-col items-center">
          <SmallGrey>{t("NoBooking")}</SmallGrey>
        </div>
      ) : (
        <>
          {currentBooking && (
            <OngoingBookingComponent booking={currentBooking} />
          )}
          {upcomingBookings.length > 0 && (
            <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-lg p-3 lg:p-4">
              <Small>{t("Upcoming")}</Small>
              {upcomingBookings.map((b, i) => {
                return (
                  <UpcomingBookingComponent
                    key={b.bookingId}
                    booking={b}
                    canStart={
                      driver?.status == DriverStatusEnum.AVAILABLE &&
                      !currentBooking &&
                      b.startDate <= new Date() &&
                      i == 0
                    }
                  />
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

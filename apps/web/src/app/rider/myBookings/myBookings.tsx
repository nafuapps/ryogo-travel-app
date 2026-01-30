import { pageClassName } from "@/components/page/pageCommons"
import { Small } from "@/components/typography"
import {
  FindDriverAssignedBookingsByIdType,
  FindDriverByUserIdType,
  FindDriverCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  CompletedBookingComponent,
  OngoingBookingComponent,
  UpcomingBookingComponent,
} from "../components/myBookingCommon"

export default async function RiderMyBookingsPageComponent({
  assignedBookings,
  completedBookings,
  driver,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  completedBookings: FindDriverCompletedBookingsByIdType
  driver: FindDriverByUserIdType
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
    <div id="RiderHomePage" className={pageClassName}>
      {currentBooking && (
        <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-lg p-3 lg:p-4">
          <Small>{t("Ongoing")}</Small>
          <OngoingBookingComponent booking={currentBooking} />
        </div>
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
      {completedBookings.length > 0 && (
        <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-lg p-3 lg:p-4">
          <Small>{t("Completed")}</Small>
          {completedBookings.map((b) => {
            return <CompletedBookingComponent key={b.bookingId} booking={b} />
          })}
        </div>
      )}
    </div>
  )
}

import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import StartTripSheet from "./startTripSheet"
import { BookingCommonInfo } from "../../components/myBookingCommon"
import { SmallBold } from "@/components/typography"
import RiderExpenseItem from "./riderExpenseItem"

export default async function RiderMyUpcomingBookingPageComponent({
  booking,
  canStartTrip,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  canStartTrip: boolean
}) {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <div id="RiderUpcomingBookingPage" className={pageClassName}>
      <BookingCommonInfo booking={booking} canCallCustomer={canStartTrip} />
      {booking.expenses.length > 0 && (
        <div
          id="UpcomingBookingExpenses"
          className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
        >
          <SmallBold>{t("Expenses")}</SmallBold>
          {booking.expenses.map((e) => {
            return (
              <RiderExpenseItem key={e.id} expense={e} bookingId={booking.id} />
            )
          })}
        </div>
      )}
      {canStartTrip && (
        <div
          id="UpcomingBookingAction"
          className="sticky bottom-1 lg:bottom-2 w-full bg-white p-1 lg:p-1.5 rounded-lg "
        >
          <StartTripSheet booking={booking} />
        </div>
      )}
    </div>
  )
}

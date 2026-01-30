import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import { BookingCommonInfo } from "@/app/rider/components/myBookingCommon"
import { SmallBold } from "@/components/typography"
import RiderExpenseItem from "./riderExpenseItem"
import RiderTripLogItem from "./riderTripLogItem"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function RiderMyCompletedBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <div id="RiderCompletedBookingPage" className={pageClassName}>
      <BookingCommonInfo booking={booking} canCallCustomer={false} />
      <div
        id="CompletedBookingTripLogs"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <SmallBold>{t("TripLogs")}</SmallBold>
        {booking.tripLogs.map((t) => {
          return <RiderTripLogItem key={t.id} tripLog={t} />
        })}
      </div>
      {booking.expenses.length > 0 && (
        <div
          id="CompletedBookingExpenses"
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
      <Link href="/rider/myBookings">
        <Button variant="default" className="w-full">
          {t("Back")}
        </Button>
      </Link>
    </div>
  )
}

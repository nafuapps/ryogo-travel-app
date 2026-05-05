import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import { BookingCommonInfo } from "@/components/rider/riderBookingCommon"
import { SmallBold } from "@/components/typography"
import RiderExpenseItem from "@/components/rider/riderExpenseItem"
import RiderTripLogItem from "@/components/rider/riderTripLogItem"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageWrapper } from "@/components/page/pageWrappers"

export default async function RiderMyCompletedBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <PageWrapper id="RiderCompletedBookingPage">
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
              <RiderExpenseItem
                key={e.id}
                expense={e}
                bookingId={booking.id}
                canModifyExpense={false}
              />
            )
          })}
        </div>
      )}
      <Link href="/rider/myBookings">
        <Button variant="default" className="w-full">
          {t("Back")}
        </Button>
      </Link>
    </PageWrapper>
  )
}

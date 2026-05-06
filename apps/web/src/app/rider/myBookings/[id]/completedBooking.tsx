import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import { BookingCommonInfo } from "@/components/rider/riderBookingCommon"
import { SmallBold } from "@/components/typography"
import RiderExpenseItem from "@/components/rider/riderExpenseItem"
import RiderTripLogItem from "@/components/rider/riderTripLogItem"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"

export default async function RiderMyCompletedBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <PageWrapper id="RiderCompletedBookingPage">
      <BookingCommonInfo booking={booking} canCallCustomer={false} />
      <ContentWrapper id="CompletedBookingTripLogs">
        <SmallBold>{t("TripLogs")}</SmallBold>
        {booking.tripLogs.map((t) => {
          return <RiderTripLogItem key={t.id} tripLog={t} />
        })}
      </ContentWrapper>
      {booking.expenses.length > 0 && (
        <ContentWrapper id="CompletedBookingExpenses">
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
        </ContentWrapper>
      )}
      <Link href="/rider/myBookings">
        <Button variant="default" className="w-full">
          {t("Back")}
        </Button>
      </Link>
    </PageWrapper>
  )
}

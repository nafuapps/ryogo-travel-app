import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import { BookingCommonInfo } from "@/components/flows/rider/riderBookingCommon"
import { RyogoSmall } from "@/components/typography"
import RiderExpenseItem from "@/components/flows/rider/riderExpenseItem"
import RiderTripLogItem from "@/components/flows/rider/riderTripLogItem"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SectionWrapper, PageWrapper } from "@/components/page/pageWrappers"

export default async function RiderMyCompletedBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <PageWrapper id="RiderCompletedBookingPage">
      <BookingCommonInfo booking={booking} canCallCustomer={false} />
      <SectionWrapper id="CompletedBookingTripLogs">
        <RyogoSmall weight="font-bold">{t("TripLogs")}</RyogoSmall>
        {booking.tripLogs.map((t) => {
          return <RiderTripLogItem key={t.id} tripLog={t} />
        })}
      </SectionWrapper>
      {booking.expenses.length > 0 && (
        <SectionWrapper id="CompletedBookingExpenses">
          <RyogoSmall weight="font-bold">{t("Expenses")}</RyogoSmall>
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
        </SectionWrapper>
      )}
      <Link href="/rider/myBookings">
        <Button variant="default" className="w-full">
          {t("Back")}
        </Button>
      </Link>
    </PageWrapper>
  )
}

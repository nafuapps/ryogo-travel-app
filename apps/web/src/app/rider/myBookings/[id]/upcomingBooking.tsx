import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import StartTripSheet from "@/components/rider/tripSheets/startTripSheet"
import { BookingCommonInfo } from "@/components/rider/riderBookingCommon"
import { SmallBold } from "@/components/typography"
import RiderExpenseItem from "@/components/rider/riderExpenseItem"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"

export default async function RiderMyUpcomingBookingPageComponent({
  booking,
  canStartTrip,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  canStartTrip: boolean
}) {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <PageWrapper id="RiderUpcomingBookingPage">
      <BookingCommonInfo booking={booking} canCallCustomer={canStartTrip} />
      {booking.expenses.length > 0 && (
        <ContentWrapper id="UpcomingBookingExpenses">
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
      {canStartTrip && (
        <div
          id="UpcomingBookingAction"
          className="sticky bottom-1 lg:bottom-2 w-full bg-white p-1 lg:p-1.5 rounded-lg "
        >
          <StartTripSheet booking={booking} />
        </div>
      )}
    </PageWrapper>
  )
}

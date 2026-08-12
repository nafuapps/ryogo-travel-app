import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import StartTripSheet from "@/components/flows/rider/tripSheets/startTripSheet"
import RiderMyBookingDetails from "@/components/flows/rider/riderMyBookingDetails"
import { RyogoSmall } from "@/components/typography"
import RiderExpenseItem from "@/components/flows/rider/riderExpenseItem"
import {
  SectionWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"

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
      <RiderMyBookingDetails booking={booking} canCallCustomer={canStartTrip} />
      {booking.expenses.length > 0 && (
        <SectionWrapper id="UpcomingBookingExpenses">
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
      {canStartTrip && (
        <StickyActionWrapper>
          <StartTripSheet booking={booking} />
        </StickyActionWrapper>
      )}
    </PageWrapper>
  )
}

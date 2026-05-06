import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import {
  BookingCommonInfo,
  getNextStep,
} from "@/components/rider/riderBookingCommon"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import StartTripSheet from "@/components/rider/tripSheets/startTripSheet"
import EndTripSheet from "@/components/rider/tripSheets/endTripSheet"
import MidTripSheet from "@/components/rider/tripSheets/midTripSheet"
import { SmallBold } from "@/components/typography"
import { UrlObject } from "url"
import RiderExpenseItem from "@/components/rider/riderExpenseItem"
import RiderTripLogItem from "@/components/rider/riderTripLogItem"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"

export default async function RiderMyOngoingBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const nextStep = getNextStep(booking.type, booking.endDate, booking.tripLogs)

  return (
    <PageWrapper id="RiderCurrentBookingPage">
      <BookingCommonInfo booking={booking} canCallCustomer={true} />
      <ContentWrapper id="CurrentBookingTripLogs">
        <SmallBold>{t("TripLogs")}</SmallBold>
        {booking.tripLogs.map((t) => {
          return <RiderTripLogItem key={t.id} tripLog={t} />
        })}
      </ContentWrapper>
      <ContentWrapper id="CurrentBookingExpenses">
        <SmallBold>{t("Expenses")}</SmallBold>
        <Link
          href={
            `/rider/myBookings/${booking.id}/add-expense` as unknown as UrlObject
          }
        >
          <Button
            type="button"
            variant={"outline"}
            form="endTrip"
            className="w-full"
          >
            {t("AddExpense")}
          </Button>
        </Link>
        {booking.expenses.map((e) => {
          return (
            <RiderExpenseItem
              key={e.id}
              expense={e}
              bookingId={booking.id}
              canModifyExpense={currentUser.userId === e.addedByUserId}
            />
          )
        })}
      </ContentWrapper>
      <div
        id="CurrentBookingAction"
        className="sticky bottom-1 lg:bottom-2 w-full bg-white p-1 lg:p-1.5 rounded-lg "
      >
        {nextStep === TripLogTypesEnum.START_TRIP ? (
          <StartTripSheet booking={booking} />
        ) : nextStep === TripLogTypesEnum.END_TRIP ? (
          <EndTripSheet booking={booking} />
        ) : (
          <MidTripSheet booking={booking} tripType={nextStep} />
        )}
      </div>
    </PageWrapper>
  )
}

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import {
  BookingCommonInfo,
  getNextStep,
} from "../../components/myBookingCommon"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import StartTripSheet from "./startTripSheet"
import EndTripSheet from "./endTripSheet"
import MidTripSheet from "./midTripSheet"
import { SmallBold } from "@/components/typography"
import { UrlObject } from "url"
import RiderExpenseItem from "./riderExpenseItem"
import RiderTripLogItem from "./riderTripLogItem"

export default async function RiderMyOngoingBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  const nextStep = getNextStep(booking.type, booking.endDate, booking.tripLogs)

  return (
    <div id="RiderCurrentBookingPage" className={pageClassName}>
      <BookingCommonInfo booking={booking} canCallCustomer={true} />
      <div
        id="CurrentBookingTripLogs"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <SmallBold>{t("TripLogs")}</SmallBold>
        {booking.tripLogs.map((t) => {
          return <RiderTripLogItem key={t.id} tripLog={t} />
        })}
      </div>
      <div
        id="CurrentBookingExpenses"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
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
            <RiderExpenseItem key={e.id} expense={e} bookingId={booking.id} />
          )
        })}
      </div>
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
    </div>
  )
}

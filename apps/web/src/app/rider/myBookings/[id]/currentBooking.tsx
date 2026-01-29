import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import {
  BookingItem,
  BookingSection,
  getNextStep,
} from "../../components/myBookingCommon"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import StartTripSheet from "./startTripSheet"
import EndTripSheet from "./endTripSheet"
import moment from "moment"
import MidTripSheet from "./midTripSheet"
import { SmallBold } from "@/components/typography"
import { UrlObject } from "url"
import RiderExpenseItem from "./riderExpenseItem"
import RiderTripLogItem from "./riderTripLogItem"

export default async function RiderMyOngoingBookingPageComponent({
  booking,
  driver,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  driver: NonNullable<FindDriverDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  const previousTripLogs = booking.tripLogs
  const previouseExpenses = booking.expenses

  const nextStep = getNextStep(booking.type, booking.endDate, booking.tripLogs)

  return (
    <div id="RiderUpcomingBookingPage" className={pageClassName}>
      <div
        id="UpcomingBookingInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <BookingSection sectionTitle={t("BookingInfo")}>
          <BookingItem title={t("BookingId")} value={booking.id} />
          <BookingItem
            title={t("CustomerName")}
            value={booking.customer.name}
          />
          {booking.customer.address && (
            <BookingItem
              title={t("CustomerAddress")}
              value={booking.customer.address}
            />
          )}
          <Button variant={"secondary"} className="sm:col-span-2 xl:col-span-3">
            <Link href={`tel:${booking.customer.phone}`} className="w-full">
              {t("CallCustomer")}
            </Link>
          </Button>
        </BookingSection>
        <Separator />
        <BookingSection sectionTitle={t("TripInfo")}>
          <BookingItem
            title={t("From")}
            value={booking.source.city + ", " + booking.source.state}
          />
          <BookingItem
            title={t("To")}
            value={booking.destination.city + ", " + booking.destination.state}
          />
          <BookingItem
            title={t("StartDate")}
            value={moment(booking.startDate).format("DD MMM")}
          />
          <BookingItem
            title={t("EndDate")}
            value={moment(booking.endDate).format("DD MMM")}
          />
          <BookingItem
            title={t("Distance")}
            value={booking.citydistance + t("Km")}
          />
          <BookingItem title={t("Type")} value={booking.type.toUpperCase()} />
          <BookingItem
            title={t("Passengers")}
            value={booking.passengers.toString()}
          />
          <BookingItem
            title={t("NeedsAC")}
            value={booking.needsAc ? t("Yes") : t("No")}
          />
          {booking.pickupAddress && (
            <BookingItem
              title={t("PickupAddress")}
              value={booking.pickupAddress!}
            />
          )}
          {booking.dropAddress && (
            <BookingItem
              title={t("DropAddress")}
              value={booking.dropAddress!}
            />
          )}
          {booking.startTime && (
            <BookingItem
              title={t("StartTime")}
              value={moment(booking.startTime!, "hh:mm:ss").format("h:mm a")}
            />
          )}
          {booking.remarks && (
            <BookingItem title={t("Remarks")} value={booking.remarks!} />
          )}
        </BookingSection>
      </div>
      <div
        id="CompletedBookingTripLogs"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <SmallBold>{t("TripLogs")}</SmallBold>
        {booking.tripLogs.map((t) => {
          return <RiderTripLogItem key={t.id} tripLog={t} />
        })}
      </div>
      <div
        id="CompletedBookingExpenses"
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
      <div className="sticky bottom-1 lg:bottom-2 w-full bg-white p-1 lg:p-1.5 rounded-lg ">
        {nextStep == TripLogTypesEnum.START_TRIP ? (
          <StartTripSheet booking={booking} />
        ) : nextStep == TripLogTypesEnum.END_TRIP ? (
          <EndTripSheet booking={booking} />
        ) : (
          <MidTripSheet booking={booking} tripType={nextStep} />
        )}
      </div>
    </div>
  )
}

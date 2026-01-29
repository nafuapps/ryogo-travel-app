import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import {
  BookingItem,
  BookingSection,
} from "@/app/rider/components/myBookingCommon"
import { Separator } from "@/components/ui/separator"
import moment from "moment"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UrlObject } from "url"
import { SmallBold } from "@/components/typography"
import RiderExpenseItem from "./riderExpenseItem"
import RiderTripLogItem from "./riderTripLogItem"

export default async function RiderMyCompletedBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <div id="RiderCompletedBookingPage" className={pageClassName}>
      <div
        id="CompletedBookingInfo"
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
    </div>
  )
}

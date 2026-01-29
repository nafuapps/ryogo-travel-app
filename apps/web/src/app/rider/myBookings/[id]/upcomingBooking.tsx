import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import StartTripSheet from "./startTripSheet"
import { BookingItem, BookingSection } from "../../components/myBookingCommon"

export default async function RiderMyAssignedBookingPageComponent({
  booking,
  driver,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  driver: NonNullable<FindDriverDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  const canStartTrip =
    booking.startDate <= new Date() &&
    driver.status == DriverStatusEnum.AVAILABLE

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
          {canStartTrip && (
            <Button
              variant={"secondary"}
              className="sm:col-span-2 xl:col-span-3"
            >
              <Link href={`tel:${booking.customer.phone}`} className="w-full">
                {t("CallCustomer")}
              </Link>
            </Button>
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
      {canStartTrip && (
        <div className="sticky bottom-1 lg:bottom-2 w-full bg-white p-1 lg:p-1.5 rounded-lg ">
          <StartTripSheet booking={booking} />
        </div>
      )}
    </div>
  )
}

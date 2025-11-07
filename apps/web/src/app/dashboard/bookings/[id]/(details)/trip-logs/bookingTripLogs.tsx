import { pageClassName } from "@/components/page/pageCommons"
import {
  bookingServices,
  FindBookingTripLogsByIdType,
} from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "../bookingDetailHeaderTabs"

export default async function BookingTripLogsPageComponent({
  bookingId,
  bookingTripLogs,
}: {
  bookingId: string
  bookingTripLogs: FindBookingTripLogsByIdType
}) {
  const t = await getTranslations("Dashboard.BookingTripLogs")

  return (
    <div id="BookingTripLogsPage" className={pageClassName}>
      <BookindDetailHeaderTabs id={bookingId} selectedTab="TripLogs" />
    </div>
  )
}

import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "../bookingDetailHeaderTabs"
import { SmallGrey } from "@/components/typography"
import TripLogItem from "./tripLogItem"

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
      {bookingTripLogs.length === 0 ? (
        <div className="w-full text-center">
          <SmallGrey>{t("NoTripLogs")}</SmallGrey>
        </div>
      ) : (
        <div
          id="BookingTripLogsInfo"
          className="flex flex-col gap-3 lg:gap-4 w-full"
        >
          {bookingTripLogs.map((tripLog) => (
            <TripLogItem key={tripLog.id} tripLog={tripLog} />
          ))}
        </div>
      )}
    </div>
  )
}

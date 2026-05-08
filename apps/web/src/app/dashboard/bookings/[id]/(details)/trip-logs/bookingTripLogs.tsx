import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import { RyogoSmall } from "@/components/typography"
import TripLogItem from "@/components/flows/bookings/tripLog/tripLogItem"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"

export default async function BookingTripLogsPageComponent({
  bookingId,
  bookingTripLogs,
}: {
  bookingId: string
  bookingTripLogs: FindBookingTripLogsByIdType
}) {
  const t = await getTranslations("Dashboard.BookingTripLogs")

  return (
    <PageWrapper id="BookingTripLogsPage">
      <BookindDetailHeaderTabs id={bookingId} selectedTab="TripLogs" />
      <SectionColWrapper center>
        {bookingTripLogs.length === 0 ? (
          <RyogoSmall color="slate">{t("NoTripLogs")}</RyogoSmall>
        ) : (
          bookingTripLogs.map((tripLog) => (
            <TripLogItem key={tripLog.id} tripLog={tripLog} />
          ))
        )}
      </SectionColWrapper>
    </PageWrapper>
  )
}

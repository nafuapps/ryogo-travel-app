import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import { RyogoSmall } from "@/components/typography"
import TripLogItem from "@/components/flows/bookings/tripLog/tripLogItem"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"
import MyBookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/myBookingDetailHeaderTabs"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"

export default async function MyBookingTripLogsPageComponent({
  bookingId,
  bookingTripLogs,
}: {
  bookingId: string
  bookingTripLogs: FindBookingTripLogsByIdType
}) {
  const t = await getTranslations("Rider.MyBookingTripLogs")

  return (
    <PageWrapper id="MyBookingTripLogsPage">
      <MyBookingDetailHeaderTabs id={bookingId} selectedTab={"TripLogs"} />
      <SectionColWrapper>
        {bookingTripLogs.length === 0 ? (
          <RyogoSmall color="slate">{t("NoTripLogs")}</RyogoSmall>
        ) : (
          bookingTripLogs
            .filter((tripLog) => tripLog.type !== TripLogTypesEnum.OTHER)
            .map((tripLog) => (
              <TripLogItem key={tripLog.id} tripLog={tripLog} />
            ))
        )}
      </SectionColWrapper>
    </PageWrapper>
  )
}

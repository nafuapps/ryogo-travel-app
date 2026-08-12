import { FindVehicleCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/cards/booking/bookingCards"

export default async function VehicleCompletedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindVehicleCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.VehicleCompletedBookings")

  return (
    <PageWrapper id="VehicleCompletedBookingsPage">
      <VehicleDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <SectionWrapper center id="VehicleCompletedBookingsList">
        {bookings.length > 0 ? (
          bookings.map((trip) => (
            <CompletedBookingCard key={trip.bookingId} booking={trip} />
          ))
        ) : (
          <RyogoCaption color="light">{t("NoBookings")}</RyogoCaption>
        )}
      </SectionWrapper>
    </PageWrapper>
  )
}

import { FindVehicleCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import { CheckCheck } from "lucide-react"

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
      <SectionWrapper id="VehicleCompletedBookingsList">
        <SectionHeaderWrapper
          icon={CheckCheck}
          label={t("Title")}
          count={bookings.length}
        />
        <TileGridWrapper>
          {bookings.map((trip) => (
            <CompletedBookingCard key={trip.id} booking={trip} />
          ))}
        </TileGridWrapper>
      </SectionWrapper>
    </PageWrapper>
  )
}

import { FindVehicleCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  StickyActionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import { CheckCheck, TicketX } from "lucide-react"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

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
        {bookings.length > 0 ? (
          <TileGridWrapper>
            {bookings.map((trip) => (
              <CompletedBookingCard key={trip.id} booking={trip} />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={TicketX} label={t("NoTrips")} />
        )}
      </SectionWrapper>
      <StickyActionWrapper>
        <HelpIconButton
          href={"/dashboard/support/help-vehicles#bookings"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

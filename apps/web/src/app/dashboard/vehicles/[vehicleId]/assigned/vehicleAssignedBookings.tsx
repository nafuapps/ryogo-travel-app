import { FindVehicleAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function VehicleAssignedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindVehicleAssignedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.VehicleAssignedBookings")
  const inProgressBookings = bookings.filter(
    (b) => b.status === BookingStatusEnum.IN_PROGRESS,
  )
  const upcomingBookings = bookings.filter(
    (b) => b.status === BookingStatusEnum.CONFIRMED,
  )

  return (
    <PageWrapper id="VehicleAssignedBookingsPage">
      <VehicleDetailHeaderTabs selectedTab={"Assigned"} id={id} />
      <SectionWrapper className="items-center" id="VehicleAssignedBookingsList">
        {bookings.length === 0 ? (
          <RyogoCaption color="light">{t("NoBookings")}</RyogoCaption>
        ) : (
          <>
            {inProgressBookings.map((trip) => (
              <OngoingBookingCard key={trip.id} booking={trip} />
            ))}
            {upcomingBookings.map((trip) => (
              <UpcomingBookingCard key={trip.id} booking={trip} />
            ))}
          </>
        )}
      </SectionWrapper>
    </PageWrapper>
  )
}

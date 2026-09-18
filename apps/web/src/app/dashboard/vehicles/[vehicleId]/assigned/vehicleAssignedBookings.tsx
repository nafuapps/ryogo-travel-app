import { FindVehicleAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Clock, Route } from "lucide-react"

export default async function VehicleAssignedBookingsPageComponent({
  bookings,
  id,
  isOwner,
  userId,
}: {
  bookings: FindVehicleAssignedBookingsByIdType
  id: string
  isOwner: boolean
  userId: string
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
      {inProgressBookings.length > 0 && (
        <SectionWrapper id="VehicleOngoingBooking">
          <SectionHeaderWrapper
            icon={Route}
            label={t("Ongoing")}
            count={inProgressBookings.length}
          />
          <TileGridWrapper>
            {inProgressBookings.map((trip) => (
              <OngoingBookingCard key={trip.id} booking={trip} />
            ))}
          </TileGridWrapper>
        </SectionWrapper>
      )}
      <SectionWrapper id="VehicleAssignedBookingsList">
        <SectionHeaderWrapper
          icon={Clock}
          label={t("Assigned")}
          count={upcomingBookings.length}
        />
        <TileGridWrapper>
          {upcomingBookings.map((trip) => (
            <UpcomingBookingCard
              key={trip.id}
              booking={trip}
              canAssign={isOwner || trip.assignedUser.id === userId}
            />
          ))}
        </TileGridWrapper>
      </SectionWrapper>
    </PageWrapper>
  )
}

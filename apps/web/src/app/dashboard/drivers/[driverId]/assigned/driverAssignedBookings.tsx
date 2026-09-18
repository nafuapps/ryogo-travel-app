import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
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
import { Route, Clock } from "lucide-react"

export default async function DriverAssignedBookingsPageComponent({
  bookings,
  id,
  isOwner,
  userId,
}: {
  bookings: FindDriverAssignedBookingsByIdType
  id: string
  isOwner: boolean
  userId: string
}) {
  const t = await getTranslations("Dashboard.DriverAssignedBookings")
  const inProgressBookings = bookings.filter(
    (b) => b.status === BookingStatusEnum.IN_PROGRESS,
  )
  const upcomingBookings = bookings.filter(
    (b) => b.status === BookingStatusEnum.CONFIRMED,
  )
  return (
    <PageWrapper id="DriverAssignedBookingsPage">
      <DriverDetailHeaderTabs selectedTab={"Assigned"} id={id} />
      {inProgressBookings.length > 0 && (
        <SectionWrapper id="DriverOngoingBooking">
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
      <SectionWrapper id="DriverAssignedBookingsList">
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

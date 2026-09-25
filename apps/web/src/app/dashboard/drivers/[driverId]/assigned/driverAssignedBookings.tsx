import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  StickyActionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Route, Clock, TicketX } from "lucide-react"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

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
        {upcomingBookings.length > 0 ? (
          <TileGridWrapper>
            {upcomingBookings.map((trip) => (
              <UpcomingBookingCard
                key={trip.id}
                booking={trip}
                canAssign={isOwner || trip.assignedUser.id === userId}
              />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={TicketX} label={t("NoTrips")} />
        )}
      </SectionWrapper>
      <StickyActionWrapper>
        <HelpIconButton
          href={"/dashboard/support/help-drivers#bookings"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

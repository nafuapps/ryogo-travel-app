import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { FindUserAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/user.services"
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
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

export default async function UserAssignedPageComponent({
  bookings,
  id,
}: {
  bookings: FindUserAssignedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.UserAssignedBookings")
  const inProgressBookings = bookings.filter(
    (b) => b.status === BookingStatusEnum.IN_PROGRESS,
  )
  const assignedBookings = bookings.filter(
    (b) => b.status === BookingStatusEnum.CONFIRMED,
  )
  return (
    <PageWrapper id="UserAssignedBookingsPage">
      <UserDetailHeaderTabs selectedTab={"Assigned"} id={id} />
      {inProgressBookings.length > 0 && (
        <SectionWrapper id="UserOngoingBookingsList">
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
      <SectionWrapper id="UserAssignedBookingsList">
        <SectionHeaderWrapper
          icon={Clock}
          label={t("Assigned")}
          count={assignedBookings.length}
        />
        {assignedBookings.length > 0 ? (
          <TileGridWrapper>
            {assignedBookings.map((trip) => (
              <UpcomingBookingCard key={trip.id} booking={trip} canAssign />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={TicketX} label={t("NoTrips")} />
        )}
      </SectionWrapper>
      <StickyActionWrapper>
        <HelpIconButton
          href={"/dashboard/support/help-users#managing"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

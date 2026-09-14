import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { FindUserAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/cards/booking/bookingCards"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

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
      <SectionWrapper className="items-center" id="UserAssignedBookingsList">
        {bookings.length === 0 ? (
          <RyogoCaption color="light">{t("NoBookings")}</RyogoCaption>
        ) : (
          <>
            {inProgressBookings.map((trip) => (
              <OngoingBookingCard key={trip.id} booking={trip} />
            ))}
            {assignedBookings.map((trip) => (
              <UpcomingBookingCard key={trip.id} booking={trip} />
            ))}
          </>
        )}
      </SectionWrapper>
    </PageWrapper>
  )
}

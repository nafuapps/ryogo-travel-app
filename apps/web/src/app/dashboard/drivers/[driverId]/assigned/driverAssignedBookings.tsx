import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/cards/booking/bookingCards"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function DriverAssignedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverAssignedBookingsByIdType
  id: string
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
      <SectionWrapper className="items-center" id="DriverAssignedBookingsList">
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

import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/cards/booking/bookingCards"

export default async function DriverAssignedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverAssignedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.DriverAssignedBookings")
  const inProgressBookings = bookings.filter((b) => b.status)
  const upcomingBookings = bookings.filter((b) => !b.status)
  return (
    <PageWrapper id="DriverAssignedBookingsPage">
      <DriverDetailHeaderTabs selectedTab={"Assigned"} id={id} />
      <SectionWrapper center id="DriverAssignedBookingsList">
        {bookings.length === 0 ? (
          <RyogoCaption color="light">{t("NoBookings")}</RyogoCaption>
        ) : (
          <>
            {inProgressBookings.map((trip) => (
              <OngoingBookingCard key={trip.bookingId} booking={trip} />
            ))}
            {upcomingBookings.map((trip) => (
              <UpcomingBookingCard key={trip.bookingId} booking={trip} />
            ))}
          </>
        )}
      </SectionWrapper>
    </PageWrapper>
  )
}

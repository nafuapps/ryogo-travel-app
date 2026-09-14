import { FindCustomerUpcomingBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/cards/booking/bookingCards"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function CustomerUpcomingBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindCustomerUpcomingBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.CustomerUpcomingBookings")
  const inProgressBookings = bookings.filter(
    (b) => b.status === BookingStatusEnum.IN_PROGRESS,
  )
  const upcomingBookings = bookings.filter(
    (b) => b.status === BookingStatusEnum.CONFIRMED,
  )
  return (
    <PageWrapper id="CustomerUpcomingBookingsPage">
      <CustomerDetailHeaderTabs selectedTab={"Upcoming"} id={id} />
      <SectionWrapper center id="CustomerUpcomingBookingsList">
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

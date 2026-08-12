import { FindDriverCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/cards/booking/bookingCards"

export default async function UserCompletedPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.DriverCompletedBookings")

  return (
    <PageWrapper id="DriverCompletedBookingsPage">
      <UserDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <SectionWrapper center id="DriverCompletedBookingsList">
        {bookings.length > 0 ? (
          bookings.map((trip) => (
            <CompletedBookingCard key={trip.bookingId} booking={trip} />
          ))
        ) : (
          <RyogoCaption color="light">{t("NoBookings")}</RyogoCaption>
        )}
      </SectionWrapper>
    </PageWrapper>
  )
}

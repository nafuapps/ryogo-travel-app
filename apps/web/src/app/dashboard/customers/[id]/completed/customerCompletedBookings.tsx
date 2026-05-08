import { FindCustomerCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/cards/booking/bookingCards"

export default async function CustomerCompletedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindCustomerCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.CustomerCompletedBookings")

  return (
    <PageWrapper id="CustomerCompletedBookingsPage">
      <CustomerDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <SectionWrapper id="CustomerCompletedBookingsList" center>
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

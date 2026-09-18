import { FindCustomerCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import { CheckCheck } from "lucide-react"

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
      <SectionWrapper id="CustomerCompletedBookingsList">
        <SectionHeaderWrapper
          icon={CheckCheck}
          label={t("Title")}
          count={bookings.length}
        />
        <TileGridWrapper>
          {bookings.map((trip) => (
            <CompletedBookingCard key={trip.id} booking={trip} />
          ))}
        </TileGridWrapper>
      </SectionWrapper>
    </PageWrapper>
  )
}

import { FindDriverCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import { CheckCheck } from "lucide-react"

export default async function DriverCompletedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.DriverCompletedBookings")

  return (
    <PageWrapper id="DriverCompletedBookingsPage">
      <DriverDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <SectionWrapper id="DriverCompletedBookingsList">
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

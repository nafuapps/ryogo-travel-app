import { FindDriverCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  StickyActionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import { CheckCheck, TicketX } from "lucide-react"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

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
        {bookings.length > 0 ? (
          <TileGridWrapper>
            {bookings.map((trip) => (
              <CompletedBookingCard key={trip.id} booking={trip} />
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

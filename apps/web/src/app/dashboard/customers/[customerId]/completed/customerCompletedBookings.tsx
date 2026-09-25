import { FindCustomerCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
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
          href={"/dashboard/support/help-customers#bookings"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

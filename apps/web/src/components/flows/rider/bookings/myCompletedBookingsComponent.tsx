import { CheckCheck, TicketX } from "lucide-react"
import {
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { FindDriverCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"

export default async function MyCompletedBookingsComponent({
  completedBookings,
}: {
  completedBookings: FindDriverCompletedBookingsByIdType
}) {
  const t = await getTranslations("Rider.MyBookings.Completed")

  return (
    <SectionWrapper id="CompletedBookingsSection">
      <SectionHeaderWrapper
        icon={CheckCheck}
        label={t("Title")}
        count={completedBookings.length}
      />
      {completedBookings.length > 0 ? (
        <TileGridWrapper>
          {completedBookings.map((trip) => (
            <CompletedBookingCard key={trip.id} booking={trip} rider />
          ))}
        </TileGridWrapper>
      ) : (
        <EmptyStateIcon icon={TicketX} label={t("NoTrips")} />
      )}
    </SectionWrapper>
  )
}

import { getTranslations } from "next-intl/server"
import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { CompletedBookingCard } from "@/components/flows/bookings/cards/bookingCards"
import { FindUserCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { CheckCheck } from "lucide-react"

export default async function UserCompletedPageComponent({
  bookings,
  id,
}: {
  bookings: FindUserCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.UserCompletedBookings")

  return (
    <PageWrapper id="UserCompletedBookingsPage">
      <UserDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <SectionWrapper id="UserCompletedBookingsList">
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

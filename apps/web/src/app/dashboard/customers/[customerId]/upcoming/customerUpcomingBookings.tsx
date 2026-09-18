import { FindCustomerUpcomingBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Route, Clock } from "lucide-react"

export default async function CustomerUpcomingBookingsPageComponent({
  bookings,
  id,
  isOwner,
  userId,
}: {
  bookings: FindCustomerUpcomingBookingsByIdType
  id: string
  isOwner: boolean
  userId: string
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
      {inProgressBookings.length > 0 && (
        <SectionWrapper id="CustomerOngoingBooking">
          <SectionHeaderWrapper
            icon={Route}
            label={t("Ongoing")}
            count={inProgressBookings.length}
          />
          <TileGridWrapper>
            {inProgressBookings.map((trip) => (
              <OngoingBookingCard key={trip.id} booking={trip} />
            ))}
          </TileGridWrapper>
        </SectionWrapper>
      )}
      <SectionWrapper id="CustomerUpcomingBookingsList">
        <SectionHeaderWrapper
          icon={Clock}
          label={t("Upcoming")}
          count={upcomingBookings.length}
        />
        <TileGridWrapper>
          {upcomingBookings.map((trip) => (
            <UpcomingBookingCard
              key={trip.id}
              booking={trip}
              canAssign={isOwner || trip.assignedUser.id === userId}
            />
          ))}
        </TileGridWrapper>
      </SectionWrapper>
    </PageWrapper>
  )
}

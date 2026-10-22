import BookingHistoryChartComponent from "@/components/flows/bookings/home/bookingHistoryChartComponent"
import BookingScheduleChartComponent from "@/components/flows/bookings/home/bookingScheduleChartComponent"
import OngoingBookingsComponent from "@/components/flows/bookings/home/ongoingBookingsComponent"
import UpcomingBookingsComponent from "@/components/flows/bookings/home/upcomingBookingsComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import DashboardHeader from "@/components/header/dashboardHeader"
import AllBookingsHeaderTabs from "@/components/header/detailHeaderTabs/allBookingsHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = currentUser.agencyId

  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  const ongoingTrips = await bookingServices.findOngoingTrips(agencyId)

  const upcomingBookings = await bookingServices.findUpcomingBookingsNextDays(
    agencyId,
    currentUser.isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  const bookingsSchedule14Days =
    await bookingServices.findBookingsScheduleNextDays(agencyId, 14)

  const bookingsHistory14Days =
    await bookingServices.findBookingsHistoryLastDays(agencyId, 14)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings"} />
      <AllBookingsHeaderTabs selectedTab={"Home"} />
      <PageWrapper id="BookingsPage">
        {ongoingTrips.length > 0 && (
          <OngoingBookingsComponent
            ongoingTrips={ongoingTrips}
            userId={currentUser.userId}
            isOwner={isOwner}
          />
        )}
        <UpcomingBookingsComponent
          upcomingBookings={upcomingBookings}
          userId={currentUser.userId}
          isOwner={isOwner}
        />
        <BookingScheduleChartComponent
          bookingsSchedule14Days={bookingsSchedule14Days}
          userId={currentUser.userId}
          isOwner={isOwner}
        />
        <BookingHistoryChartComponent
          bookingsHistory14Days={bookingsHistory14Days}
        />
        <StickyActionWrapper>
          <HelpIconButton
            href={"/dashboard/support/help-bookings"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}

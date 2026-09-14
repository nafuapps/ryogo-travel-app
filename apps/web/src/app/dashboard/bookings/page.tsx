import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import OngoingBookingsComponent from "@/components/flows/bookings/home/ongoingBookingsComponent"
import AllBookingsHeaderTabs from "@/components/header/detailHeaderTabs/allBookingsHeaderTabs"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import UpcomingBookingsComponent from "@/components/flows/bookings/home/upcomingBookingsComponent"
import BookingScheduleChartComponent from "@/components/flows/bookings/home/bookingScheduleChartComponent"
import BookingHistoryChartComponent from "@/components/flows/bookings/home/bookingHistoryChartComponent"

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

  const ongoingTrips = await bookingServices.findOngoingTrips(agencyId)

  const upcomingBookings = await bookingServices.findUpcomingBookingsNextDays(
    agencyId,
    30,
  )

  const bookingsSchedule14Days =
    await bookingServices.findBookingsScheduleNextDays(agencyId, 14)

  const bookingsHistory14Days =
    await bookingServices.findBookingsHistoryLastDays(agencyId, 14)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings"} />
      <PageWrapper id="BookingsPage">
        <AllBookingsHeaderTabs selectedTab={"Upcoming"} />
        <OngoingBookingsComponent
          ongoingTrips={ongoingTrips}
          userId={currentUser.userId}
        />
        <UpcomingBookingsComponent
          upcomingBookings={upcomingBookings}
          userId={currentUser.userId}
        />
        <BookingScheduleChartComponent
          bookingsSchedule14Days={bookingsSchedule14Days}
        />
        <BookingHistoryChartComponent
          bookingsHistory14Days={bookingsHistory14Days}
        />
      </PageWrapper>
    </MainWrapper>
  )
}

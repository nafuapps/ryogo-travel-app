import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import BookingScheduleComponent from "@/components/flows/bookings/home/bookingScheduleComponent"
import BookingHistoryComponent from "@/components/flows/bookings/home/bookingHistoryComponent"
import UpcomingBookingsComponent from "@/components/flows/bookings/home/upcomingBookingsComponent"
import OngoingBookingsComponent from "@/components/flows/bookings/home/ongoingBookingsComponent"
import AllBookingsHeaderTabs from "@/components/header/detailHeaderTabs/allBookingsHeaderTabs"

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

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings"} />
      <PageWrapper id="BookingsPage">
        <AllBookingsHeaderTabs selectedTab={"Bookings"} />
        <OngoingBookingsComponent agencyId={agencyId} />
        <UpcomingBookingsComponent agencyId={agencyId} />
        <BookingScheduleComponent agencyId={agencyId} />
        <BookingHistoryComponent agencyId={agencyId} />
      </PageWrapper>
    </MainWrapper>
  )
}

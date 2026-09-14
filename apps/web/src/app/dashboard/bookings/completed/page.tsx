import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import CompletedBookingsComponent from "@/components/flows/bookings/home/completedBookingsComponent"
import AllBookingsHeaderTabs from "@/components/header/detailHeaderTabs/allBookingsHeaderTabs"

export const metadata: Metadata = {
  title: `Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function CompletedBookingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const completedBookings =
    await bookingServices.findCompletedBookingsPreviousDays(
      currentUser.agencyId,
      30,
    )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/completed"} />
      <PageWrapper id="CompletedBookingsPage">
        <AllBookingsHeaderTabs selectedTab={"Completed"} />
        <CompletedBookingsComponent
          completedBookings={completedBookings}
          userId={currentUser.userId}
        />
      </PageWrapper>
    </MainWrapper>
  )
}

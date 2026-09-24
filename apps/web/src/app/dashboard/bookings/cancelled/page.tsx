import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import CancelledBookingsComponent from "@/components/flows/bookings/home/cancelledBookingsComponent"
import AllBookingsHeaderTabs from "@/components/header/detailHeaderTabs/allBookingsHeaderTabs"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

export const metadata: Metadata = {
  title: `Cancelled Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function CancelledBookingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const cancelledBookings =
    await bookingServices.findCancelledBookingsPreviousDays(
      currentUser.agencyId,
      30,
    )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/cancelled"} />
      <PageWrapper id="CancelledBookingsPage">
        <AllBookingsHeaderTabs selectedTab={"Cancelled"} />
        <CancelledBookingsComponent
          cancelledBookings={cancelledBookings}
          userId={currentUser.userId}
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

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import LeadBookingsComponent from "@/components/flows/bookings/home/leadBookingsComponent"
import AllBookingsHeaderTabs from "@/components/header/detailHeaderTabs/allBookingsHeaderTabs"

export const metadata: Metadata = {
  title: `Booking Leads - ${pageTitle}`,
  description: pageDescription,
}

export default async function LeadBookingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const leadBookings14Days = await bookingServices.findLeadBookingsNextDays(
    currentUser.agencyId,
    14,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/leads"} />
      <PageWrapper id="LeadBookingsPage">
        <AllBookingsHeaderTabs selectedTab={"Leads"} />
        <LeadBookingsComponent leadBookings14Days={leadBookings14Days} />
      </PageWrapper>
    </MainWrapper>
  )
}

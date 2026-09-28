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
import LeadBookingsComponent from "@/components/flows/bookings/home/leadBookingsComponent"
import AllBookingsHeaderTabs from "@/components/header/detailHeaderTabs/allBookingsHeaderTabs"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Booking Leads - ${pageTitle}`,
  description: pageDescription,
}

export default async function LeadBookingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const leadBookings = await bookingServices.findLeadBookingsNextDays(
    currentUser.agencyId,
    30,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/leads"} />
      <AllBookingsHeaderTabs selectedTab={"Leads"} />
      <PageWrapper id="LeadBookingsPage">
        <LeadBookingsComponent
          leadBookings={leadBookings}
          userId={currentUser.userId}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
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

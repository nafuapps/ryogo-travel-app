import CompletedBookingsComponent from "@/components/flows/bookings/home/completedBookingsComponent"
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
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function CompletedBookingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = currentUser.agencyId
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isSubscribed = currentUser.isSubscribed

  const completedBookings =
    await bookingServices.findCompletedBookingsPreviousDays(
      currentUser.agencyId,
      isSubscribed || APP_TRIAL_MODE
        ? PREMIUM_SEARCH_DAYS
        : BASIC_SEARCH_LIMIT_DAYS,
    )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/completed"} />
      <AllBookingsHeaderTabs selectedTab={"Completed"} />
      <PageWrapper id="CompletedBookingsPage">
        <CompletedBookingsComponent
          completedBookings={completedBookings}
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

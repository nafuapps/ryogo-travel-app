import MyUpcomingBookingsComponent from "@/components/flows/rider/bookings/myUpcomingBookingsComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import MyBookingsHeaderTabs from "@/components/header/detailHeaderTabs/myBookingsHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"
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
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `My Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyBookingsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isSubscribed = currentUser.isSubscribed

  const assignedBookings = await driverServices.findDriverAssignedBookingsById(
    driver.id,
    isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings"} />
      <MyBookingsHeaderTabs selectedTab={"Upcoming"} />
      <PageWrapper id="RiderMyBookingsPage">
        <MyUpcomingBookingsComponent
          assignedBookings={assignedBookings}
          driverStatus={driver.status}
        />
        <StickyActionWrapper>
          <HelpIconButton
            href={"/rider/mySupport/help-bookings"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}

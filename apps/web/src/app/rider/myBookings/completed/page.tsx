import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import { Metadata } from "next"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import MyBookingsHeaderTabs from "@/components/header/detailHeaderTabs/myBookingsHeaderTabs"
import MyCompletedBookingsComponent from "@/components/flows/rider/bookings/myCompletedBookingsComponent"

export const metadata: Metadata = {
  title: `My Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyCompletedBookingsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  const completedBookings =
    await driverServices.findDriverCompletedBookingsById(driver.id)

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings/completed"} />
      <PageWrapper id="MyCompletedBookingsPage">
        <MyBookingsHeaderTabs selectedTab={"Completed"} />
        <MyCompletedBookingsComponent completedBookings={completedBookings} />
        <StickyActionWrapper>
          <HelpIconButton
            href={"/rider/mySupport/help-bookings#completed"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}

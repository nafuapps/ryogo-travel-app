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
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import MyUpcomingBookingsComponent from "@/components/flows/rider/bookings/myUpcomingBookingsComponent"

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

  const upcomingBookings = (
    await driverServices.findDriverAssignedBookingsById(driver.id)
  ).filter((booking) => booking.status === BookingStatusEnum.CONFIRMED)

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings"} />
      <MyBookingsHeaderTabs selectedTab={"Upcoming"} />
      <PageWrapper id="RiderMyBookingsPage">
        <MyUpcomingBookingsComponent
          upcomingBookings={upcomingBookings}
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

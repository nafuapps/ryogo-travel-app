import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import RiderMyBookingsPageComponent from "./myBookings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

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

  const assignedBookings = await driverServices.findDriverAssignedBookingsById(
    driver.id,
  )

  const completedBookings =
    await driverServices.findDriverCompletedBookingsById(driver.id)

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings"} />
      <RiderMyBookingsPageComponent
        assignedBookings={assignedBookings}
        completedBookings={completedBookings}
        driver={driver}
      />
    </MainWrapper>
  )
}

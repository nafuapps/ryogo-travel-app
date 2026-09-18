import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import DriverAssignedBookingsPageComponent from "./driverAssignedBookings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Driver Assigned Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriverAssignedBookingsPage({
  params,
}: {
  params: Promise<{ driverId: string }>
}) {
  const { driverId } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const bookings = await driverServices.findDriverAssignedBookingsById(driverId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/assigned"} />
      <DriverAssignedBookingsPageComponent
        bookings={bookings}
        id={driverId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        userId={currentUser.userId}
      />
    </MainWrapper>
  )
}

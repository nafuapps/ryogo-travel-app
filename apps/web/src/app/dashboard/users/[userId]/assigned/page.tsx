import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import UserAssignedPageComponent from "./userAssignedBookings"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `User Assigned Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  let bookings
  if (user.userRole === UserRolesEnum.DRIVER) {
    bookings = await driverServices.findDriverAssignedBookingsById(userId)
  } else {
    bookings = await userServices.findUserAssignedBookingsById(userId)
  }
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/[id]/assigned"} />
      <UserAssignedPageComponent bookings={bookings} id={userId} />
    </MainWrapper>
  )
}

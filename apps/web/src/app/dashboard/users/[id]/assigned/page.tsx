//Users/id/assigned bookings page

import { mainClassName } from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "../../../components/extra/dashboardHeader"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import UserAssignedPageComponent from "./userAssignedBookings"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await userServices.findUserDetailsById(id)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  let bookings
  if (user.userRole == UserRolesEnum.DRIVER) {
    bookings = await driverServices.findDriverAssignedBookingsById(id)
  } else {
    bookings = await userServices.findUserAssignedBookingsById(id)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/[id]/assigned"} />
      <UserAssignedPageComponent bookings={bookings} id={id} />
    </div>
  )
}

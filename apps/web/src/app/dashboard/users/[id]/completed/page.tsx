//Users/id/completed bookings page

import { mainClassName } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "../../../components/common/dashboardHeader"
import UserCompletedPageComponent from "./userCompletedBookings"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Completed Bookings - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function UserCompletedBookingsPage({
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
  if (user.userRole === UserRolesEnum.DRIVER) {
    bookings = await driverServices.findDriverCompletedBookingsById(id)
  } else {
    bookings = await userServices.findUserCompletedBookingsById(id)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/[id]/completed"} />
      <UserCompletedPageComponent bookings={bookings} id={id} />
    </div>
  )
}

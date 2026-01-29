//MyBookings page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "../components/riderHeader"
import RiderMyBookingsPageComponent from "./myBookings"

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
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myBookings"} />
      <RiderMyBookingsPageComponent
        assignedBookings={assignedBookings}
        completedBookings={completedBookings}
        driver={driver}
      />
    </div>
  )
}

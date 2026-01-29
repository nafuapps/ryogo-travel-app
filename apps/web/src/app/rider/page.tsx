//Rider home page

import { mainClassName } from "@/components/page/pageCommons"
import RiderHeader from "./components/riderHeader"
import RiderHomePageComponent from "./riderHome"
import { redirect, RedirectType } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export default async function RiderHomePage() {
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

  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider"} />
      <RiderHomePageComponent
        assignedBookings={assignedBookings}
        driver={driver}
      />
    </div>
  )
}

//MyBookings page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderAddExpensePageComponent from "./riderAddExpense"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import RiderHeader from "@/app/rider/components/riderHeader"

export default async function RiderAddExpensePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  if (driver.status != DriverStatusEnum.ON_TRIP) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myBooking/[id]/add-expense"} />
      <RiderAddExpensePageComponent />
    </div>
  )
}

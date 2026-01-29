//MyBookings page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/app/rider/components/riderHeader"
import RiderModifyExpensePageComponent from "./riderModifyExpense"

export default async function RiderModifyExpensePage({
  params,
}: {
  params: Promise<{ id: string; expId: string }>
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myBooking/[id]/modify-expense"} />
      <RiderModifyExpensePageComponent />
    </div>
  )
}

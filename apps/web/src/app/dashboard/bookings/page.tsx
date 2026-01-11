//All Bookings page

import { mainClassName } from "@/components/page/pageCommons"
import BookingsPageComponent from "./bookings"
import DashboardHeader from "../components/extra/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function BookingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/dashboard", RedirectType.replace)
  }
  const agencyId = user.agencyId
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings"} />
      <BookingsPageComponent agencyId={agencyId} />
    </div>
  )
}

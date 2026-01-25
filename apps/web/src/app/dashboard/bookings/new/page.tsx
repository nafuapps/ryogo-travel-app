//Bookings/new page

import { mainClassName } from "@/components/page/pageCommons"
import NewBookingPageComponent from "./newBooking"
import DashboardHeader from "../../components/extra/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

export default async function NewBookingPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/new"} />
      <NewBookingPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
      />
    </div>
  )
}

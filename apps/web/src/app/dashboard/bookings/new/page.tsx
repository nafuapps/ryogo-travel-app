import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import NewBookingPageComponent from "./newBooking"
import DashboardHeader from "../../components/common/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `New Booking - ${pageTitle}`,
  description: pageDescription,
}

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

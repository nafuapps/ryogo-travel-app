import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import NewBookingPageComponent from "./newBooking"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

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
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/new"} />
      <NewBookingPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
      />
    </MainWrapper>
  )
}

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import BookingsPageComponent from "./bookings"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = user.agencyId
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings"} />
      <BookingsPageComponent agencyId={agencyId} />
    </MainWrapper>
  )
}

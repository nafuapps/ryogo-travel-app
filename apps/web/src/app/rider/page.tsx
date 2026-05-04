//Rider home page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import RiderHeader from "@/components/header/riderHeader"
import RiderHomePageComponent from "./riderHome"
import { redirect, RedirectType } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Rider Home - ${pageTitle}`,
  description: pageDescription,
}

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
    <MainWrapper>
      <RiderHeader pathName={"/rider"} />
      <RiderHomePageComponent
        assignedBookings={assignedBookings}
        driver={driver}
      />
    </MainWrapper>
  )
}

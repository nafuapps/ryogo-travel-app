import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import AddDriverPageComponent from "./addDriver"
import { Metadata } from "next"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"

export const metadata: Metadata = {
  title: `Onboarding Add Driver - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddDriverPage() {
  const currentUser = await getCurrentUser()
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Check for Onboarding flow
  const agencyData = await agencyServices.findAgencyData(currentUser.agencyId)
  if (agencyData.vehicles.length < 1) {
    redirect("/onboarding/add-vehicle", RedirectType.replace)
  }
  if (agencyData.drivers.length > 0) {
    if (agencyData.agents.length < 1) {
      redirect("/onboarding/add-agent", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  const allDrivers = await userServices.findAllUsersByRole([
    UserRolesEnum.DRIVER,
  ])

  return (
    <AddDriverPageComponent
      agencyId={currentUser.agencyId}
      agencyName={agency.businessName}
      userId={currentUser.userId}
      userStatus={currentUser.status}
      allDrivers={allDrivers}
    />
  )
}

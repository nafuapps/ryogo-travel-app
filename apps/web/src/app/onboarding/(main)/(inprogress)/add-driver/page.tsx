import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { notFound, redirect, RedirectType } from "next/navigation"
import AddDriverPageComponent from "./addDriver"

export const metadata: Metadata = {
  title: `Onboarding Add Driver - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddDriverPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  //Check for Onboarding flow
  const agencyData = await agencyServices.findAgencyData(currentUser.agencyId)
  if (!agencyData) {
    notFound()
  }
  if (agencyData.vehicles.length < 1) {
    redirect("/onboarding/add-vehicle", RedirectType.replace)
  }
  if (agencyData.drivers.length > 0) {
    if (agencyData.agents.length < 1) {
      redirect("/onboarding/add-agent", RedirectType.replace)
    }
    redirect("/dashboard/home", RedirectType.replace)
  }

  const allDrivers = await userServices.findAllUsersByRole([
    UserRolesEnum.DRIVER,
  ])

  return (
    <AddDriverPageComponent
      agencyId={currentUser.agencyId}
      userId={currentUser.userId}
      agencyName={agencyData.agencyName}
      allDrivers={allDrivers}
    />
  )
}

//(Onboarding) Add vehicle page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { Metadata } from "next"
import { notFound, redirect, RedirectType } from "next/navigation"
import AddVehiclePageComponent from "./addVehicle"

export const metadata: Metadata = {
  title: `Onboarding Add Vehicle - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddVehiclePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  //Check for Onboarding flow status
  const agencyData = await agencyServices.findAgencyData(currentUser.agencyId)
  if (!agencyData) {
    notFound()
  }
  if (agencyData.vehicles.length > 0) {
    if (agencyData.drivers.length < 1) {
      redirect("/onboarding/add-driver", RedirectType.replace)
    }
    if (agencyData.agents.length < 1) {
      redirect("/onboarding/add-agent", RedirectType.replace)
    }
    redirect("/dashboard/home", RedirectType.replace)
  }

  return (
    <AddVehiclePageComponent
      agencyId={currentUser.agencyId}
      userId={currentUser.userId}
    />
  )
}

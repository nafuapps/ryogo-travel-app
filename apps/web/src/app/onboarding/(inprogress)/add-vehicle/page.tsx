//(Onboarding) Add vehicle page

import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import AddVehiclePageComponent from "./addVehicle"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export const metadata: Metadata = {
  title: `Onboarding Add Vehicle - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddVehiclePage() {
  const currentUser = await getCurrentUser()
  //If not logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Check for Onboarding flow status
  const agencyData = await agencyServices.findAgencyData(currentUser.agencyId)
  if (agencyData.vehicles.length > 0) {
    if (agencyData.drivers.length < 1) {
      redirect("/onboarding/add-driver", RedirectType.replace)
    }
    if (agencyData.agents.length < 1) {
      redirect("/onboarding/add-agent", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <AddVehiclePageComponent
      agencyId={currentUser.agencyId}
      status={currentUser.status}
    />
  )
}

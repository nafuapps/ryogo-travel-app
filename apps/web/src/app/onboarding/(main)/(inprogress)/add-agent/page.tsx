//(Onboarding) Add agent page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { notFound, redirect, RedirectType } from "next/navigation"
import AddAgentPageComponent from "./addAgent"

export const metadata: Metadata = {
  title: `Onboarding Add Agent - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddAgentPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  //Check for Onboarding flow
  const agencyData = await agencyServices.findAgencyData(currentUser.agencyId)
  if (!agencyData) {
    notFound()
  }
  if (agencyData.vehicles.length < 1) {
    redirect("/onboarding/add-vehicle", RedirectType.replace)
  }
  if (agencyData.drivers.length < 1) {
    redirect("/onboarding/add-driver", RedirectType.replace)
  }
  if (agencyData.agents.length > 0) {
    redirect("/dashboard/home", RedirectType.replace)
  }

  const allAgents = await userServices.findAllUsersByRole([UserRolesEnum.AGENT])

  //Only owner can add agent
  return (
    <AddAgentPageComponent
      agencyId={currentUser.agencyId}
      agencyName={agencyData.agencyName}
      allAgents={allAgents}
    />
  )
}

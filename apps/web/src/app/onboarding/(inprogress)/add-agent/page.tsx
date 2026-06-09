//(Onboarding) Add agent page

import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import AddAgentPageComponent from "./addAgent"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export const metadata: Metadata = {
  title: `Onboarding Add Agent - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddAgentPage() {
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
  if (agencyData.drivers.length < 1) {
    redirect("/onboarding/add-driver", RedirectType.replace)
  }
  if (agencyData.agents.length > 0) {
    redirect("/dashboard", RedirectType.replace)
  }

  const allAgents = await userServices.findAllUsersByRole([UserRolesEnum.AGENT])

  //Only owner can add agent
  return (
    <AddAgentPageComponent
      agencyId={currentUser.agencyId}
      agencyName={agency.businessName}
      ownerId={currentUser.userId}
      status={currentUser.status}
      allAgents={allAgents}
    />
  )
}

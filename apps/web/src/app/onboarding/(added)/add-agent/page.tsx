//(Onboarding) Add agent page

import { Metadata } from "next"
import AddAgentPageComponent from "./addAgent"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export const metadata: Metadata = {
  title: "Add Agent Page | RyoGo",
  description: "Add Agent page for RyoGo Travel App",
}

export default async function AddAgentPage() {
  const currentUser = await getCurrentUser()
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Not owner
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    //New users
    if (currentUser.status === UserStatusEnum.NEW) {
      //Go to change password
      redirect("/onboarding/change-password", RedirectType.replace)
    }
    //Old users
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      //If driver, go to rider page
      redirect("/rider", RedirectType.replace)
    }
    //Else, go to dashboard
    redirect("/dashboard", RedirectType.replace)
  }

  //Check for Onboarding flow
  const agencyData = await agencyServices.getAgencyData(currentUser.agencyId)
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
      ownerId={currentUser.userId}
      status={currentUser.status}
      allAgents={allAgents}
    />
  )
}

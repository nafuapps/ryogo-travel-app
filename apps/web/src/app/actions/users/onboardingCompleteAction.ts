"use server"

import { getCurrentUser } from "@/lib/auth"
import { updateSessionUserStatus } from "@/lib/session"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect } from "next/navigation"

export async function onboardingCompleteAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser || UserRolesEnum.OWNER !== currentUser.userRole) {
    return
  }

  //Activate owner account
  await userServices.activateUser(currentUser.userId)
  //Activate agency
  await agencyServices.activateAgency(currentUser.agencyId)
  //Update status in session cookie
  await updateSessionUserStatus(UserStatusEnum.ACTIVE)

  redirect("/dashboard")
}

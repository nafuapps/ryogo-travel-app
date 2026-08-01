"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { updateUserStatusInWebSession } from "@/lib/session"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"

export async function onboardingCompleteAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser || UserRolesEnum.OWNER !== currentUser.userRole) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  //Activate owner account
  await userServices.activateUser(currentUser.userId)
  //Activate agency
  await agencyServices.activateAgency(currentUser.agencyId)
  //Update status in session cookie
  await updateUserStatusInWebSession(UserStatusEnum.ACTIVE)
}

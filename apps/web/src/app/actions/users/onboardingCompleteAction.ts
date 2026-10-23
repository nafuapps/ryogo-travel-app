"use server"

import { writePermissions } from "@/lib/permissions"
import { updateUserStatusInWebSession } from "@/lib/session"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"

export async function onboardingCompleteAction(agencyId: string) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  //Activate owner account
  await userServices.activateUser({ userId: currentUser.userId })
  //Activate agency
  await agencyServices.activateAgency(currentUser.agencyId, true)
  //Update status in session cookie
  await updateUserStatusInWebSession(UserStatusEnum.ACTIVE)
}

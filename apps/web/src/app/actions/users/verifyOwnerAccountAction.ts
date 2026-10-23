"use server"

import { writePermissions } from "@/lib/permissions"
import { updateUserVerificationInWebSession } from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

//Onboarding verify account step flow
export async function verifyOwnerAccountAction(agencyId: string) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser || !currentUser.isAdmin) {
    return
  }

  const verifiedUser = await userServices.verifyOwner(currentUser.userId)
  if (!verifiedUser || !verifiedUser.isVerified) return

  //Update verification in session cookie
  await updateUserVerificationInWebSession(verifiedUser.isVerified)

  return verifiedUser
}

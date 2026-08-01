"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { updateUserVerificationInWebSession } from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function verifyAccountAction() {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.userRole !== UserRolesEnum.OWNER) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.verifyUser(currentUser.userId)
  if (!user || !user.isVerified) return

  //Update verification in session cookie
  await updateUserVerificationInWebSession(user.isVerified)

  return user
}

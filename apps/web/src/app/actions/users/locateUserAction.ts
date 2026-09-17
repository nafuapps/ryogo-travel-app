"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export async function locateUserAction(
  userId: string,
  agencyId: string,
  lat: number,
  long: number,
) {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.agencyId !== agencyId) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  await userServices.locateUser(userId, lat, long)
}

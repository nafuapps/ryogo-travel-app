"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function deleteDriverLeaveAction(
  leaveId: string,
  userId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.agencyId !== agencyId ||
    (currentUser.userId !== userId &&
      currentUser.userRole !== UserRolesEnum.OWNER)
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const leave = await driverServices.removeDriverLeave(leaveId)
  if (!leave) return

  return leave
}

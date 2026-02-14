"use server"

import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function activateDriverAction(
  id: string,
  userId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const driver = await driverServices.activateDriver(id, userId)
  return driver
}

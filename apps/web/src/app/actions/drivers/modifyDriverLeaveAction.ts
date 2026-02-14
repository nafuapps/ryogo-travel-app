"use server"

import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import {
  InsertDriverLeaveType,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"

export async function modifyDriverLeaveAction(
  id: string,
  data: Partial<InsertDriverLeaveType>,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }
  const leave = await driverServices.modifyDriverLeave(id, data)
  return leave
}

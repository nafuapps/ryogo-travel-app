"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { AddTripLogRequestType } from "@ryogo-travel-app/api/types/tripLog.types"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function otherTripLogAction({
  data,
}: {
  data: AddTripLogRequestType
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.DRIVER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  // Create Other Trip Log
  const newTripLog = await tripLogServices.addTripLog(data)
  if (!newTripLog) return

  return newTripLog
}

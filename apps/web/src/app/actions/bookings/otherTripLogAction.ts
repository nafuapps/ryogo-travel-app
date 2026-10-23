"use server"

import { writePermissions } from "@/lib/permissions"
import { tripLogServices } from "@ryogo-travel-app/api/services/tripLog.services"
import { AddTripLogRequestType } from "@ryogo-travel-app/api/types/tripLog.types"

export async function otherTripLogAction({
  data,
  assignedDriverUserId,
}: {
  data: AddTripLogRequestType
  assignedDriverUserId?: string | null
}) {
  const currentUser = await writePermissions.allowAssignedDriver({
    agencyId: data.agencyId,
    assignedDriverUserId,
  })
  if (!currentUser) {
    return
  }

  // Create Other Trip Log
  const newTripLog = await tripLogServices.addTripLog(data)
  if (!newTripLog) return

  return newTripLog
}

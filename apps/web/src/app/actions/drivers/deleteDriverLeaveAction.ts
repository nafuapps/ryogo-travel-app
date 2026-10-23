"use server"

import { writePermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export async function deleteDriverLeaveAction({
  leaveId,
  userId,
  agencyId,
}: {
  leaveId: string
  userId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const removedLeave = await driverServices.removeDriverLeave(leaveId)

  return removedLeave
}

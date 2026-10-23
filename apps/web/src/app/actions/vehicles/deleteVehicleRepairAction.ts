"use server"

import { writePermissions } from "@/lib/permissions"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"

export async function deleteVehicleRepairAction({
  repairId,
  userId,
  agencyId,
}: {
  repairId: string
  userId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) {
    return
  }

  const removedRepair = await vehicleServices.removeVehicleRepair(repairId)
  if (!removedRepair) return

  return removedRepair
}

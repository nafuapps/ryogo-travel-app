"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function finishVehicleRepairAction(
  userId: string,
  vehicleId: string,
  repairId: string,
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

  const repair = await vehicleServices.endVehicleRepair(repairId, vehicleId)
  if (!repair) return

  return repair
}

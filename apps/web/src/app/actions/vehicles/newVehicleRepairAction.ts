"use server"

import { getCurrentUser } from "@/lib/auth"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  InsertVehicleRepairType,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"

export async function newVehicleRepairAction(data: InsertVehicleRepairType) {
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
  const leave = await vehicleServices.addVehicleRepair(data)
  return leave
}

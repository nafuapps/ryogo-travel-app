"use server"

import { getCurrentUser } from "@/lib/auth"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function activateVehicleAction(id: string, agencyId: string) {
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
  const vehicle = await vehicleServices.activateVehicle(id)
  return vehicle
}

"use server"

import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { InsertVehicleRepairType } from "@ryogo-travel-app/db/schema"

export async function modifyVehicleRepairAction(
  id: string,
  data: Partial<InsertVehicleRepairType>,
) {
  const repair = await vehicleServices.modifyVehicleRepair(id, data)
  if (!repair) return false
  return true
}

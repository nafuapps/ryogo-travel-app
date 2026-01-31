"use server"

import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { InsertVehicleRepairType } from "@ryogo-travel-app/db/schema"

export async function newVehicleRepairAction(data: InsertVehicleRepairType) {
  const leave = await vehicleServices.addVehicleRepair(data)
  if (!leave) return false
  return true
}

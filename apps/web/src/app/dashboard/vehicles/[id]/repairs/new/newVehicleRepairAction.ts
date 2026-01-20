"use server"

import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  InsertVehicleRepairType,
  SelectVehicleRepairType,
} from "@ryogo-travel-app/db/schema"

export async function newVehicleRepairAction(data: InsertVehicleRepairType) {
  const leave: SelectVehicleRepairType[] =
    await vehicleServices.addVehicleRepair(data)
  return leave[0]
}

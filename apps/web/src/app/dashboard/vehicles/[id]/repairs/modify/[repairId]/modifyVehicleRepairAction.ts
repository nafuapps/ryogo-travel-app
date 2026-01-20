"use server"

import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  InsertVehicleRepairType,
  SelectVehicleRepairType,
} from "@ryogo-travel-app/db/schema"

export async function modifyVehicleRepairAction(
  id: string,
  data: Partial<InsertVehicleRepairType>,
) {
  const repair: SelectVehicleRepairType[] =
    await vehicleServices.modifyVehicleRepair(id, data)
  return repair[0]
}

"use server"

import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"

export async function inactivateVehicleAction(id: string) {
  const vehicle = await vehicleServices.inactivateVehicle(id)
  if (!vehicle) return false
  return true
}

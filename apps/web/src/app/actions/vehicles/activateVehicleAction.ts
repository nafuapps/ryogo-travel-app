"use server"

import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"

export async function activateVehicleAction(id: string) {
  const vehicle = await vehicleServices.activateVehicle(id)
  if (!vehicle) return false
  return true
}

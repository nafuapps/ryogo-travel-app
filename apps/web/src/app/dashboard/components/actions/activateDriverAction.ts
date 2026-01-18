"use server"

import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export async function activateDriverAction(id: string) {
  const driver = await driverServices.activateDriver(id)
  if (!driver) return false
  return true
}

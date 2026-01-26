"use server"

import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export async function activateDriverAction(id: string, userId: string) {
  const driver = await driverServices.activateDriver(id, userId)
  if (!driver) return false
  return true
}

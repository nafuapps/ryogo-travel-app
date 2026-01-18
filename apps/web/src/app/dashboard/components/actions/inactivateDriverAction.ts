"use server"

import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export async function inactivateDriverAction(id: string) {
  const driver = await driverServices.inactivateDriver(id)
  if (!driver) return false
  return true
}

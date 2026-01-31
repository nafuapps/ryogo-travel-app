"use server"

import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { InsertDriverLeaveType } from "@ryogo-travel-app/db/schema"

export async function newDriverLeaveAction(data: InsertDriverLeaveType) {
  const leave = await driverServices.addDriverLeave(data)
  return leave
}

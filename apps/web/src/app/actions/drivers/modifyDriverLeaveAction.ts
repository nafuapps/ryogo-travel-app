"use server"

import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { InsertDriverLeaveType } from "@ryogo-travel-app/db/schema"

export async function modifyDriverLeaveAction(
  id: string,
  data: Partial<InsertDriverLeaveType>,
) {
  const leave = await driverServices.modifyDriverLeave(id, data)
  return leave[0]
}

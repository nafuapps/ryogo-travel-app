"use server"

import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import {
  InsertDriverLeaveType,
  SelectDriverLeaveType,
} from "@ryogo-travel-app/db/schema"

export async function newDriverLeaveAction(data: InsertDriverLeaveType) {
  const leave: SelectDriverLeaveType[] =
    await driverServices.addDriverLeave(data)
  return leave[0]
}

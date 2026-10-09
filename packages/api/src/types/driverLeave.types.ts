import { DriverLeaveStatusEnum } from "@ryogo-travel-app/db/schema"

export type ModifyDriverLeaveRequestType = {
  leaveId: string
  agencyId: string
  startDate: Date
  endDate: Date
  remarks?: string
}

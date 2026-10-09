export type ModifyDriverLeaveRequestType = {
  leaveId: string
  agencyId: string
  driverId: string
  startDate: Date
  endDate: Date
  remarks?: string
}

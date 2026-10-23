export type ModifyDriverLeaveRequestType = {
  leaveId: string
  agencyId: string
  driverId: string
  addedByUserId: string
  startDate: Date
  endDate: Date
  remarks?: string
}

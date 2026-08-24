export type ModifyDriverLeaveRequestType = {
  leaveId: string
  agencyId: string
  startDate: Date
  endDate: Date
  isCompleted: boolean
  remarks?: string
}

export type ModifyVehicleRepairRequestType = {
  repairId: string
  agencyId: string
  startDate: Date
  endDate: Date
  isCompleted: boolean
  cost?: number
  remarks?: string
}

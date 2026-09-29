export type ModifyVehicleRepairRequestType = {
  repairId: string
  agencyId: string
  startDate: Date
  endDate: Date
  cost?: number
  remarks?: string
}

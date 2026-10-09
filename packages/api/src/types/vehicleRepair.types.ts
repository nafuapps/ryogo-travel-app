export type ModifyVehicleRepairRequestType = {
  repairId: string
  agencyId: string
  vehicleId: string
  startDate: Date
  endDate: Date
  cost?: number
  remarks?: string
}

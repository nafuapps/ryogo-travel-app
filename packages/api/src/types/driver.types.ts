export type CreateDriverType = {
  agencyId: string
  userId: string
  name: string
  phone: string
  address: string
  licenseNumber: string
  licenseExpiresOn: Date
  canDriveVehicleTypes: string[]
  defaultAllowancePerDay?: number
}

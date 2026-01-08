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

// /api/new-driver (POST)
export type NewDriverAPIRequestType = {
  agencyId: string
  data: {
    name: string
    phone: string
    email: string
    licenseNumber: string
    licenseExpiresOn: Date
    address: string
    canDriveVehicleTypes: string[]
    defaultAllowancePerDay?: number | undefined
  }
}
export type NewDriverAPIResponseType = {
  id: string
  userId: string
}

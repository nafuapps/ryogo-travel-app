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

export type NewDriverRequestType = {
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
    licensePhotos?: FileList | undefined
    driverPhotos?: FileList | undefined
  }
}
export type NewDriverResponseType = {
  id: string
  userId: string
}

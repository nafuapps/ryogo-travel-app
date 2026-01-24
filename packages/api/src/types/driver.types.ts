import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

export type NewDriverRequestType = {
  agencyId: string
  data: {
    name: string
    phone: string
    email: string
    licenseNumber: string
    licenseExpiresOn: Date
    address: string
    canDriveVehicleTypes: VehicleTypesEnum[]
    defaultAllowancePerDay?: number | undefined
    licensePhotos?: FileList | undefined
    driverPhotos?: FileList | undefined
  }
}
export type NewDriverResponseType = {
  id: string
  userId: string
}

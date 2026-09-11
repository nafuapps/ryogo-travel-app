import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

export type ModifyDriverRequestType = {
  driverId: string
  agencyId: string
  addedByUserId: string
  canDriveVehicleTypes: VehicleTypesEnum[]
  address?: string
  defaultAllowancePerDay?: number
}

export type ChangeDriverLicenseRequestType = {
  driverId: string
  agencyId: string
  addedByUserId: string
  licenseNumber?: string
  licenseExpiresOn?: Date
  licensePhotos?: FileList
}

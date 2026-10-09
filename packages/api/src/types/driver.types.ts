import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

export type ModifyDriverRequestType = {
  id: string
  agencyId: string
  addedByUserId: string
  canDriveVehicleTypes: VehicleTypesEnum[]
  address?: string
  defaultAllowancePerDay?: number
}

export type ChangeDriverLicenseRequestType = {
  id: string
  agencyId: string
  addedByUserId: string
  licenseNumber?: string
  licenseExpiresOn?: Date
  licensePhotos?: FileList
  licensePhotoUrl?: string
}

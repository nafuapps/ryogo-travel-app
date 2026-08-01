import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

export type ModifyDriverRequestType = {
  address?: string
  canDriveVehicleTypes?: VehicleTypesEnum[]
  defaultAllowancePerDay?: number
  licenseNumber?: string
  licenseExpiresOn?: Date
  licensePhotos?: FileList
}

import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

export type ModifyDriverRequestType = {
  driverId: string
  agencyId: string
  canDriveVehicleTypes: VehicleTypesEnum[]
  address?: string
  defaultAllowancePerDay?: number
  licenseNumber?: string
  licenseExpiresOn?: Date
  licensePhotos?: FileList
}

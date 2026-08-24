import {
  VehicleBrandEnum,
  VehicleColorEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"

export type AddVehicleRequestType = {
  agencyId: string
  data: {
    vehicleNumber: string
    type: VehicleTypesEnum
    brand: VehicleBrandEnum
    color: VehicleColorEnum
    model: string
    capacity?: number
    odometerReading?: number
    insuranceExpiresOn?: Date
    pucExpiresOn?: Date
    rcExpiresOn?: Date
    hasAC?: boolean
    defaultRatePerKm?: number
    defaultAcChargePerDay?: number
    rcPhotos?: FileList
    vehiclePhotos?: FileList
    insurancePhotos?: FileList
    pucPhotos?: FileList
  }
}

export type ModifyVehicleRequestType = {
  vehicleId: string
  agencyId: string
  type?: VehicleTypesEnum
  brand?: VehicleBrandEnum
  color?: VehicleColorEnum
  model?: string
  capacity?: number
  odometerReading?: number
  rcExpiresOn?: Date
  insuranceExpiresOn?: Date
  pucExpiresOn?: Date
  defaultRatePerKm?: number
  hasAC?: boolean
  defaultAcChargePerDay?: number
  rcPhotos?: FileList
  pucPhotos?: FileList
  insurancePhotos?: FileList
}

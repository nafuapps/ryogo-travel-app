import {
  VehicleBrandEnum,
  VehicleColorEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"

export type AddVehicleRequestType = {
  agencyId: string
  addedByUserId: string
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
  defaultRatePerKm?: number
  hasAC?: boolean
  defaultAcChargePerDay?: number
}

export type ChangeVehicleDocumentRequestType = {
  vehicleId: string
  agencyId: string
  addedByUserId: string
  type: "rc" | "insurance" | "puc"
  expiresOn?: Date
  photo?: FileList
}

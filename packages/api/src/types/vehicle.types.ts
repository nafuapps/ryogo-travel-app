import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

export type AddVehicleRequestType = {
  agencyId: string
  data: {
    vehicleNumber: string
    type: VehicleTypesEnum
    brand: string
    color: string
    model: string
    capacity?: number | undefined
    odometerReading: number | undefined
    insuranceExpiresOn: Date
    pucExpiresOn: Date
    rcExpiresOn: Date
    hasAC: boolean
    defaultRatePerKm?: number | undefined
    defaultAcChargePerDay?: number | undefined
    rcPhotos?: FileList | undefined
    vehiclePhotos?: FileList | undefined
    insurancePhotos?: FileList | undefined
    pucPhotos?: FileList | undefined
  }
}

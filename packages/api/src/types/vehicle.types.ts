// /api/onboarding/add-vehicle (POST)
export type OnboardingAddVehicleAPIRequestType = {
  agencyId: string
  data: {
    vehicleNumber: string
    type: string
    brand: string
    color: string
    model: string
    capacity?: number | undefined
    odometerReading: number | undefined
    insuranceExpiresOn: Date
    pucExpiresOn: Date
    hasAC: boolean
    defaultRatePerKm?: number | undefined
    defaultAcChargePerDay?: number | undefined
  }
}

export type OnboardingAddVehicleAPIResponseType = {
  id: string
}

export type NewVehicleRequestType = {
  agencyId: string
  data: {
    vehicleNumber: string
    type: string
    brand: string
    color: string
    model: string
    capacity?: number | undefined
    odometerReading: number | undefined
    insuranceExpiresOn: Date
    pucExpiresOn: Date
    hasAC: boolean
    defaultRatePerKm?: number | undefined
    defaultAcChargePerDay?: number | undefined
    rcPhotos?: FileList | undefined
    vehiclePhotos?: FileList | undefined
    insurancePhotos?: FileList | undefined
    pucPhotos?: FileList | undefined
  }
}

export type NewVehicleResponseType = {
  id: string
}

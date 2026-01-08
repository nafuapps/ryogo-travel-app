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

// /api/new-vehicle/existing-vehicle?vehicleNumber=[vehicleNumber]&agency=[agency] (GET)
export type NewVehicleExistingAPIResponseType = {
  id: string
}[]

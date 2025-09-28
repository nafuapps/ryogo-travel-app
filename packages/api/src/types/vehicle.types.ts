// /api/onboarding/add-vehicle/check-vehicle-agency/[agencyId] (GET)
export type OnboardingCheckVehicleAgencyAPIRequestType = {};
export type OnboardingCheckVehicleAgencyAPIResponseType = {
  id: string;
}[];

// /api/onboarding/add-vehicle (POST)
export type OnboardingAddVehicleAPIRequestType = {
  agencyId: string;
  data: {
    vehicleNumber: string;
    type: string;
    brand: string;
    color: string;
    model: string;
    capacity?: number | undefined;
    odometerReading: number | undefined;
    insuranceExpiresOn: string;
    pucExpiresOn: string;
    hasAC: boolean;
    defaultRatePerKm?: number | undefined;
    extraAcChargePerDay?: number | undefined;
  };
};

export type OnboardingAddVehicleAPIResponseType = {
  id: string;
};

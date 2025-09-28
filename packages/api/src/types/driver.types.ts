export type CreateDriverType = {
  agencyId: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseExpiresOn: string;
  canDriveVehicleTypes: string[];
  defaultAllowancePerDay?: number;
};

// /api/onboarding/add-driver/check-driver-agency/[agencyId] (GET)
export type OnboardingCheckDriverAgencyAPIRequestType = {};
export type OnboardingCheckDriverAgencyAPIResponseType = {
  id: string;
}[];

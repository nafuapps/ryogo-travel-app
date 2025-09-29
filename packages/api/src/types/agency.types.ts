export type CreateAgencyType = {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  commissionRate?: number;
  agencyState: string;
  agencyCity: string;
};

// /api/onboarding/create-account/existing-agency (GET)
export type OnboardingExistingAgencyAPIRequestType = {};
export type OnboardingExistingAgencyAPIResponseType = {
  id: string;
}[];

// /api/onboarding/check-agency-data/[agencyId] (GET)
export type OnboardingCheckAgencyDataAPIRequestType = {};
export type OnboardingCheckAgencyDataAPIResponseType = {
  vehicles: {
    id: string;
  }[];
  drivers: {
    id: string;
  }[];
  agents: {
    id: string;
  }[];
};

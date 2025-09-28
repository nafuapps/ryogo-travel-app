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

import { UserRolesEnum } from "@ryogo-travel-app/db/schema";

// /api/auth/login (POST)
export type LoginAPIRequestType = {
  phone: string;
};
export type LoginAPIResponseType = {
  id: string;
}[];

// /api/auth/login/accounts/[phone] (GET)
export type LoginAccountsAPIRequestType = {
  phone: string;
};
export type LoginAccountsAPIResponseType = {
  id: string;
  name: string;
  agencyId: string;
  phone: string;
  userRole: UserRolesEnum;
  agency: {
    businessName: string;
  };
}[];

// /api/auth/login/password (POST)
export type LoginPasswordAPIRequestType = {
  userId: string;
  password: string;
};
export type LoginPasswordAPIResponseType =
  | {
      id: string;
      userRole: string;
    }
  | null
  | undefined;

// /api/auth/reset (POST)
export type ResetPasswordAPIRequestType = {
  userId: string;
  email: string;
};
export type ResetPasswordAPIResponseType = {
  id: string;
};

// /api/auth/signup (POST)
export type SignupAPIRequestType = {
  phone: string;
};
export type SignupAPIResponseType = {
  id: string;
}[];

// /api/auth/signup/existing/[phone] (GET)
export type SignupExistingAPIRequestType = {
  phone: string;
};
export type SignupExistingAPIResponseType = {
  id: string;
  name: string;
  agencyId: string;
  phone: string;
  userRole: UserRolesEnum;
  agency: {
    businessName: string;
  };
}[];

// /api/onboarding/create-account/existing-owner (GET)
export type OnboardingExistingOwnerAPIRequestType = {};
export type OnboardingExistingOwnerAPIResponseType = {
  id: string;
}[];

// /api/onboarding/create-account (POST)
export type OnboardingCreateAccountAPIRequestType = {
  agency: {
    businessEmail: string;
    businessPhone: string;
    businessName: string;
    businessAddress: string;
    agencyCity: string;
    agencyState: string;
    commissionRate?: number | undefined;
  };
  owner: {
    email: string;
    phone: string;
    name: string;
    password: string;
  };
};
export type OnboardingCreateAccountAPIResponseType = {
  agencyId: string;
  userId: string;
  password: string;
};

import { SelectDriverType, UserRolesEnum } from "@ryogo-travel-app/db/schema"

// /api/auth/login (POST)
export type LoginAPIResponseType = {
  id: string
}[]

// /api/auth/login/accounts/[phone] (GET)
export type LoginAccountsAPIResponseType = {
  id: string
  name: string
  agencyId: string
  phone: string
  userRole: UserRolesEnum
  agency: {
    businessName: string
  }
}[]

// /api/auth/login/password (POST)
export type LoginPasswordAPIResponseType =
  | {
      id: string
      userRole: string
    }
  | null
  | undefined

// /api/auth/reset (POST)
export type ResetPasswordAPIResponseType = {
  id: string
}

// /api/auth/signup (POST)
export type SignupAPIResponseType = {
  id: string
}[]

// /api/auth/signup/existing/[phone] (GET)
export type SignupExistingAPIResponseType = {
  id: string
  name: string
  agencyId: string
  phone: string
  userRole: UserRolesEnum
  agency: {
    businessName: string
  }
}[]

// /api/onboarding/create-account/existing-owner?phone=[phone]&email=[email] (GET)
export type OnboardingExistingOwnerAPIResponseType = {
  id: string
}[]

// /api/onboarding/create-account (POST)
export type OnboardingCreateAccountAPIRequestType = {
  agency: {
    businessEmail: string
    businessPhone: string
    businessName: string
    businessAddress: string
    agencyCity: string
    agencyState: string
    commissionRate?: number | undefined
  }
  owner: {
    email: string
    phone: string
    name: string
    password: string
  }
}
export type OnboardingCreateAccountAPIResponseType = {
  agencyId: string
  userId: string
  password: string
}

// /api/onboarding/add-driver/existing-driver?phone=[phone]&email=[email] (GET)
export type OnboardingExistingDriverAPIResponseType = {
  id: string
}[]

// /api/onboarding/add-driver (POST)
export type OnboardingAddDriverAPIRequestType = {
  agencyId: string
  data: {
    name: string
    phone: string
    email: string
    licenseNumber: string
    licenseExpiresOn: Date
    address: string
    canDriveVehicleTypes: string[]
    defaultAllowancePerDay?: number | undefined
  }
}
export type OnboardingAddDriverAPIResponseType = {
  id: string
  userId: string
}

// /api/onboarding/add-agent/existing-agent?phone=[phone]&email=[email] (GET)
export type OnboardingExistingAgentAPIResponseType = {
  id: string
}[]

// /api/onboarding/add-agent (POST)
export type OnboardingAddAgentAPIRequestType = {
  agencyId: string
  data: {
    name: string
    phone: string
    email: string
  }
}
export type OnboardingAddAgentAPIResponseType = {
  id: string
}

// /api/onboarding/set-active/[userId] (POST)
export type OnboardingSetActiveAPIResponseType = {
  agencyId: string
}

// /api/onboarding/change-password/[userId] (POST)
export type OnboardingChangePasswordAPIRequestType = {
  oldPassword: string
  newPassword: string
}
export type OnboardingChangePasswordAPIResponseType = {
  id: string
}

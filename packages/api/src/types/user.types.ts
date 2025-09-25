import { UserRolesEnum } from "@ryogo-travel-app/db/schema";

// /api/auth/login
export type LoginRequestAPIType = {
  phone: string;
};
export type LoginResponseAPIType = {
  id: string;
}[];

// /api/auth/login/accounts
export type LoginAccountsRequestAPIType = {
  phone: string;
};
export type LoginAccountsResponseAPIType = {
  id: string;
  name: string;
  agencyId: string;
  phone: string;
  userRole: UserRolesEnum;
  agency: {
    businessName: string;
  };
}[];

// /api/auth/login/password
export type LoginPasswordRequestAPIType = {
  userId: string;
  password: string;
};
export type LoginPasswordResponseAPIType = {
  isLoginSuccess: boolean;
};

// /api/auth/reset
export type ResetPasswordRequestAPIType = {
  userId: string;
  email: string;
};
export type ResetPasswordResponseAPIType = {
  id: string;
};

// /api/auth/signup
export type SignupRequestAPIType = {
  phone: string;
};
export type SignupResponseAPIType = {
  id: string;
}[];

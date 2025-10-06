import z from "zod";

export const AgencyRegex = z.string().length(8).startsWith("A");
export const UserRegex = z.string().length(8).startsWith("U");
export const VehicleRegex = z.string().length(8).startsWith("V");
export const DriverRegex = z.string().length(8).startsWith("D");
export const CustomerRegex = z.string().length(8).startsWith("C");
export const BookingRegex = z.string().length(8).startsWith("B");

export const PhoneRegex = z
  .string()
  .length(10)
  .regex(/^[0-9]+$/);
export const EmailRegex = z.email();
export const PasswordRegex = z.string().trim().min(8);

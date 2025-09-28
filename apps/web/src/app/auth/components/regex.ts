import z from "zod";

export const UserRegex = z.string().length(8).startsWith("U");
export const AgencyRegex = z.string().length(8).startsWith("A");
export const VehicleRegex = z.string().length(8).startsWith("V");
export const DriverRegex = z.string().length(8).startsWith("D");
export const PhoneRegex = z
  .string()
  .length(10)
  .regex(/^[0-9]+$/);

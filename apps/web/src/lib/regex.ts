import z from "zod"

export const AgencyRegex = z.string().trim().length(8).startsWith("A")
export const UserRegex = z.string().trim().length(8).startsWith("U")
export const VehicleRegex = z.string().trim().length(8).startsWith("V")
export const VehicleRepairRegex = z.string().trim().length(9).startsWith("VR")
export const DriverRegex = z.string().trim().length(8).startsWith("D")
export const DriverLeaveRegex = z.string().trim().length(9).startsWith("DL")
export const CustomerRegex = z.string().trim().length(8).startsWith("C")
export const BookingRegex = z.string().trim().length(8).startsWith("B")
export const TransactionRegex = z.string().trim().length(8).startsWith("T")
export const ExpenseRegex = z.string().trim().length(8).startsWith("E")
export const TripLogRegex = z.string().trim().length(9).startsWith("TL")

export const PhoneRegex = z
  .string()
  .trim()
  .length(10)
  .regex(/^[0-9]+$/)
export const EmailRegex = z.email()
export const PasswordRegex = z.string().trim().min(8)

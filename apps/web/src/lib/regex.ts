import z from "zod"

const getStringRegex = (length: number) => z.string().trim().length(length)

export const AgencyIdRegex = getStringRegex(8).regex(/A\d{7}/)
export const OrderIdRegex = getStringRegex(8).regex(/O\d{7}/)
export const PaymentIdRegex = getStringRegex(8).regex(/P\d{7}/)
export const UserIdRegex = getStringRegex(8).regex(/U\d{7}/)
export const SessionIdRegex = getStringRegex(8).regex(/S\d{7}/)
export const RouteIdRegex = getStringRegex(8).regex(/R\d{7}/)
export const LocationIdRegex = getStringRegex(8).regex(/L\d{7}/)
export const VehicleIdRegex = getStringRegex(8).regex(/V\d{7}/)
export const DriverIdRegex = getStringRegex(8).regex(/D\d{7}/)
export const CustomerIdRegex = getStringRegex(8).regex(/C\d{7}/)
export const BookingIdRegex = getStringRegex(8).regex(/B\d{7}/)
export const TransactionIdRegex = getStringRegex(8).regex(/T\d{7}/)
export const ExpenseIdRegex = getStringRegex(8).regex(/E\d{7}/)
export const VehicleRepairIdRegex = getStringRegex(9).regex(/VR\d{7}/)
export const DriverLeaveIdRegex = getStringRegex(9).regex(/DL\d{7}/)
export const TripLogIdRegex = getStringRegex(9).regex(/TL\d{7}/)
export const MissionIdRegex = getStringRegex(12).regex(/M\d{11}/)
export const NotificationIdRegex = getStringRegex(12).regex(/N\d{11}/)
export const SupportTicketIdRegex = getStringRegex(9).regex(/ST\d{7}/)
export const ProductFeedbackIdRegex = getStringRegex(9).regex(/PB\d{7}/)

export const PhoneRegex = getStringRegex(10).regex(/^[0-9]+$/)
export const EmailRegex = z.email()
export const PasswordRegex = z.string().trim().min(8)

export const FileRegex = z.custom<FileList>(
  (value) => typeof FileList !== "undefined" && value instanceof FileList,
)

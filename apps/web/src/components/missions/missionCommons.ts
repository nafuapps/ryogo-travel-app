import {
  AgencyIdRegex,
  BookingIdRegex,
  CustomerIdRegex,
  DriverIdRegex,
  DriverLeaveIdRegex,
  ExpenseIdRegex,
  OrderIdRegex,
  SupportTicketIdRegex,
  TransactionIdRegex,
  UserIdRegex,
  VehicleIdRegex,
  VehicleRepairIdRegex,
} from "@/lib/regex"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

// export function regexCheckIDByEntityType(type: EntityTypeEnum, value: string) {
//   switch (type) {
//     case EntityTypeEnum.AGENCY:
//       return AgencyIdRegex.safeParse(value).success
//     case EntityTypeEnum.BOOKING:
//       return BookingIdRegex.safeParse(value).success
//     case EntityTypeEnum.CUSTOMER:
//       return CustomerIdRegex.safeParse(value).success
//     case EntityTypeEnum.DRIVER:
//       return DriverIdRegex.safeParse(value).success
//     case EntityTypeEnum.EXPENSE:
//       return ExpenseIdRegex.safeParse(value).success
//     case EntityTypeEnum.ORDER:
//       return OrderIdRegex.safeParse(value).success
//     case EntityTypeEnum.USER:
//       return UserIdRegex.safeParse(value).success
//     case EntityTypeEnum.VEHICLE:
//       return VehicleIdRegex.safeParse(value).success
//     case EntityTypeEnum.TRANSACTION:
//       return TransactionIdRegex.safeParse(value).success
//     case EntityTypeEnum.SUPPORT:
//       return SupportTicketIdRegex.safeParse(value).success
//     case EntityTypeEnum.DRIVER_LEAVE:
//       return DriverLeaveIdRegex.safeParse(value).success
//     case EntityTypeEnum.VEHICLE_REPAIR:
//       return VehicleRepairIdRegex.safeParse(value).success
//   }
// }

export function getEntityType(id: string | undefined) {
  if (!id) return null
  if (AgencyIdRegex.safeParse(id).success) return EntityTypeEnum.AGENCY
  if (BookingIdRegex.safeParse(id).success) return EntityTypeEnum.BOOKING
  if (CustomerIdRegex.safeParse(id).success) return EntityTypeEnum.CUSTOMER
  if (DriverIdRegex.safeParse(id).success) return EntityTypeEnum.DRIVER
  if (ExpenseIdRegex.safeParse(id).success) return EntityTypeEnum.EXPENSE
  if (OrderIdRegex.safeParse(id).success) return EntityTypeEnum.ORDER
  if (UserIdRegex.safeParse(id).success) return EntityTypeEnum.USER
  if (VehicleIdRegex.safeParse(id).success) return EntityTypeEnum.VEHICLE
  if (TransactionIdRegex.safeParse(id).success)
    return EntityTypeEnum.TRANSACTION
  if (SupportTicketIdRegex.safeParse(id).success) return EntityTypeEnum.SUPPORT
  if (DriverLeaveIdRegex.safeParse(id).success)
    return EntityTypeEnum.DRIVER_LEAVE
  if (VehicleRepairIdRegex.safeParse(id).success)
    return EntityTypeEnum.VEHICLE_REPAIR
  return null
}

export function getDateTime(date: Date, time: string) {
  return new Date(
    date.setHours(Number(time.split(":")[0]), Number(time.split(":")[1])),
  )
}

export function extractTimeFromDate(date: Date) {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return "" + hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + ""
}

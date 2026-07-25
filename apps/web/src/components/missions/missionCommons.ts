import {
  AgencyIdRegex,
  BookingIdRegex,
  CustomerIdRegex,
  DriverIdRegex,
  ExpenseIdRegex,
  OrderIdRegex,
  UserIdRegex,
  VehicleIdRegex,
} from "@/lib/regex"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export function regexCheckIDByEntityType(type: EntityTypeEnum, value: string) {
  switch (type) {
    case EntityTypeEnum.AGENCY:
      return AgencyIdRegex.safeParse(value).success
    case EntityTypeEnum.BOOKING:
      return BookingIdRegex.safeParse(value).success
    case EntityTypeEnum.CUSTOMER:
      return CustomerIdRegex.safeParse(value).success
    case EntityTypeEnum.DRIVER:
      return DriverIdRegex.safeParse(value).success
    case EntityTypeEnum.EXPENSE:
      return ExpenseIdRegex.safeParse(value).success
    case EntityTypeEnum.ORDER:
      return OrderIdRegex.safeParse(value).success
    case EntityTypeEnum.USER:
      return UserIdRegex.safeParse(value).success
    case EntityTypeEnum.VEHICLE:
      return VehicleIdRegex.safeParse(value).success
    default:
      return false
  }
}

export function getDateTime(date: Date, time: string) {
  return new Date(
    date.setHours(Number(time.split(":")[0]), Number(time.split(":")[1])),
  )
}

export function extractTimeFromDate(date: Date) {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return "" + hours + ":" + minutes + ""
}

import {
  AgencyRegex,
  BookingRegex,
  CustomerRegex,
  DriverRegex,
  ExpenseRegex,
  OrderRegex,
  UserRegex,
  VehicleRegex,
} from "@/lib/regex"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export function regexCheckIDByEntityType(type: EntityTypeEnum, value: string) {
  switch (type) {
    case EntityTypeEnum.AGENCY:
      return AgencyRegex.safeParse(value).success
    case EntityTypeEnum.BOOKING:
      return BookingRegex.safeParse(value).success
    case EntityTypeEnum.CUSTOMER:
      return CustomerRegex.safeParse(value).success
    case EntityTypeEnum.DRIVER:
      return DriverRegex.safeParse(value).success
    case EntityTypeEnum.EXPENSE:
      return ExpenseRegex.safeParse(value).success
    case EntityTypeEnum.ORDER:
      return OrderRegex.safeParse(value).success
    case EntityTypeEnum.USER:
      return UserRegex.safeParse(value).success
    case EntityTypeEnum.VEHICLE:
      return VehicleRegex.safeParse(value).success
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

import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import {
  BadgeIndianRupee,
  Tickets,
  Building,
  Car,
  CreditCard,
  HandCoins,
  IdCard,
  Megaphone,
  UserRoundCog,
} from "lucide-react"

export default function getEntityIcon(entityType: EntityTypeEnum) {
  switch (entityType) {
    case EntityTypeEnum.BOOKING:
      return Tickets
    case EntityTypeEnum.AGENCY:
      return Building
    case EntityTypeEnum.CUSTOMER:
      return BadgeIndianRupee
    case EntityTypeEnum.DRIVER:
      return IdCard
    case EntityTypeEnum.VEHICLE:
      return Car
    case EntityTypeEnum.ORDER:
      return CreditCard
    case EntityTypeEnum.EXPENSE:
      return HandCoins
    case EntityTypeEnum.USER:
      return UserRoundCog
    default:
      return Megaphone
  }
}

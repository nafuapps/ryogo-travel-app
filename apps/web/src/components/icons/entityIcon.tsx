import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import {
  BadgeIndianRupee,
  Tickets,
  Building,
  Car,
  CreditCard,
  HandCoins,
  IdCard,
  User,
  BanknoteArrowUp,
  BadgeQuestionMark,
  TreePalm,
  Wrench,
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
    case EntityTypeEnum.DRIVER_LEAVE:
      return TreePalm

    case EntityTypeEnum.VEHICLE:
      return Car
    case EntityTypeEnum.VEHICLE_REPAIR:
      return Wrench
    case EntityTypeEnum.ORDER:
      return CreditCard
    case EntityTypeEnum.EXPENSE:
      return HandCoins
    case EntityTypeEnum.USER:
      return User
    case EntityTypeEnum.TRANSACTION:
      return BanknoteArrowUp
    case EntityTypeEnum.SUPPORT:
      return BadgeQuestionMark
  }
}

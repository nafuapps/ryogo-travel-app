import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  Pizza,
  Fuel,
  ParkingSquare,
  Wrench,
  AirVent,
  Ticket,
  Banknote,
} from "lucide-react"
import { RyogoEnclosedIcon, RyogoIconType } from "@/components/icons/ryogoIcon"

export default function ExpenseIcon({
  type,
  ...props
}: Omit<RyogoIconType, "icon"> & {
  type: ExpenseTypesEnum
}) {
  let icon
  switch (type) {
    case ExpenseTypesEnum.FOOD:
      icon = Pizza
      break
    case ExpenseTypesEnum.FUEL:
      icon = Fuel
      break
    case ExpenseTypesEnum.PARKING:
      icon = ParkingSquare
      break
    case ExpenseTypesEnum.MAINTENANCE:
      icon = Wrench
      break
    case ExpenseTypesEnum.AC:
      icon = AirVent
      break
    case ExpenseTypesEnum.TOLL:
      icon = Ticket
      break
    case ExpenseTypesEnum.OTHER:
      icon = Banknote
  }
  return <RyogoEnclosedIcon icon={icon} {...props} />
}

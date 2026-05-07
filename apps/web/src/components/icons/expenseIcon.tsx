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
import { RyogoIcon } from "./RyogoIcon"

export default function getExpenseIcon(type: ExpenseTypesEnum) {
  switch (type) {
    case ExpenseTypesEnum.FOOD:
      return <RyogoIcon icon={Pizza} size="sm" />
    case ExpenseTypesEnum.FUEL:
      return <RyogoIcon icon={Fuel} size="sm" />
    case ExpenseTypesEnum.PARKING:
      return <RyogoIcon icon={ParkingSquare} size="sm" />
    case ExpenseTypesEnum.MAINTENANCE:
      return <RyogoIcon icon={Wrench} size="sm" />
    case ExpenseTypesEnum.AC:
      return <RyogoIcon icon={AirVent} size="sm" />
    case ExpenseTypesEnum.TOLL:
      return <RyogoIcon icon={Ticket} size="sm" />
    default:
      return <RyogoIcon icon={Banknote} size="sm" />
  }
}

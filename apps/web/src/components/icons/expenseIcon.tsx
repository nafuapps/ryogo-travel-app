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
      return <RyogoIcon icon={Pizza} />
    case ExpenseTypesEnum.FUEL:
      return <RyogoIcon icon={Fuel} />
    case ExpenseTypesEnum.PARKING:
      return <RyogoIcon icon={ParkingSquare} />
    case ExpenseTypesEnum.MAINTENANCE:
      return <RyogoIcon icon={Wrench} />
    case ExpenseTypesEnum.AC:
      return <RyogoIcon icon={AirVent} />
    case ExpenseTypesEnum.TOLL:
      return <RyogoIcon icon={Ticket} />
    default:
      return <RyogoIcon icon={Banknote} />
  }
}

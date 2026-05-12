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
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"

export default function getExpenseIcon(type: ExpenseTypesEnum) {
  switch (type) {
    case ExpenseTypesEnum.FOOD:
      return <RyogoEnclosedIcon icon={Pizza} size="sm" circular />
    case ExpenseTypesEnum.FUEL:
      return <RyogoEnclosedIcon icon={Fuel} size="sm" circular />
    case ExpenseTypesEnum.PARKING:
      return <RyogoEnclosedIcon icon={ParkingSquare} size="sm" circular />
    case ExpenseTypesEnum.MAINTENANCE:
      return <RyogoEnclosedIcon icon={Wrench} size="sm" circular />
    case ExpenseTypesEnum.AC:
      return <RyogoEnclosedIcon icon={AirVent} size="sm" circular />
    case ExpenseTypesEnum.TOLL:
      return <RyogoEnclosedIcon icon={Ticket} size="sm" circular />
    default:
      return <RyogoEnclosedIcon icon={Banknote} size="sm" circular />
  }
}

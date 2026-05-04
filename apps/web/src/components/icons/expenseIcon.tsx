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

export default function getExpenseIcon(
  type: ExpenseTypesEnum,
  size: "sm" | "md" | "lg" = "sm",
) {
  const className = `${size === "lg" ? "size:12 lg:size-16" : size === "md" ? "size-8 lg:size-10" : "size-4 lg:size-5"} text-slate-500`
  switch (type) {
    case ExpenseTypesEnum.FOOD:
      return <Pizza className={className} />
    case ExpenseTypesEnum.FUEL:
      return <Fuel className={className} />
    case ExpenseTypesEnum.PARKING:
      return <ParkingSquare className={className} />
    case ExpenseTypesEnum.MAINTENANCE:
      return <Wrench className={className} />
    case ExpenseTypesEnum.AC:
      return <AirVent className={className} />
    case ExpenseTypesEnum.TOLL:
      return <Ticket className={className} />
    case ExpenseTypesEnum.OTHER:
      return <Banknote className={className} />
    default:
      return <Banknote className={className} />
  }
}

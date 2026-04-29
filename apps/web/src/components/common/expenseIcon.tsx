import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  LucidePizza,
  LucideFuel,
  LucideParkingSquare,
  LucideWrench,
  LucideAirVent,
  LucideTicket,
  LucideBanknote,
} from "lucide-react"

export default function getExpenseIcon(type: ExpenseTypesEnum) {
  const className = "size-4 lg:size-5 text-slate-500"
  switch (type) {
    case ExpenseTypesEnum.FOOD:
      return <LucidePizza className={className} />
    case ExpenseTypesEnum.FUEL:
      return <LucideFuel className={className} />
    case ExpenseTypesEnum.PARKING:
      return <LucideParkingSquare className={className} />
    case ExpenseTypesEnum.MAINTENANCE:
      return <LucideWrench className={className} />
    case ExpenseTypesEnum.AC:
      return <LucideAirVent className={className} />
    case ExpenseTypesEnum.TOLL:
      return <LucideTicket className={className} />
    case ExpenseTypesEnum.OTHER:
      return <LucideBanknote className={className} />
    default:
      return <LucideBanknote className={className} />
  }
}

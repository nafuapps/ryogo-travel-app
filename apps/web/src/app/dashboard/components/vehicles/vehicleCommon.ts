import {
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import {
  LucideTruck,
  LucideBus,
  LucideCar,
  LucideMotorbike,
  LucideTractor,
} from "lucide-react"

export const getVehicleStatusColor = (status: VehicleStatusEnum) => {
  if (status === VehicleStatusEnum.AVAILABLE) {
    return "bg-green-200"
  }
  if (status === VehicleStatusEnum.REPAIR) {
    return "bg-yellow-200"
  }
  if (status === VehicleStatusEnum.INACTIVE) {
    return "bg-red-200"
  }
  return "bg-slate-200"
}

export function getVehicleIcon({
  vehicleType,
}: {
  vehicleType: VehicleTypesEnum
}) {
  if (vehicleType === VehicleTypesEnum.TRUCK) {
    return LucideTruck
  }
  if (vehicleType === VehicleTypesEnum.BUS) {
    return LucideBus
  }
  if (vehicleType === VehicleTypesEnum.CAR) {
    return LucideCar
  }
  if (vehicleType === VehicleTypesEnum.BIKE) {
    return LucideMotorbike
  }
  return LucideTractor
}

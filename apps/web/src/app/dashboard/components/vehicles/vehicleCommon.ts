import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  LucideTruck,
  LucideBus,
  LucideCar,
  LucideMotorbike,
  LucideTractor,
} from "lucide-react"

export function getVehicleIcon(vehicleType: VehicleTypesEnum) {
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

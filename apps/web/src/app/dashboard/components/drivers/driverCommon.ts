import { DriverStatusEnum, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  LucideBus,
  LucideCar,
  LucideMotorbike,
  LucideRows3,
  LucideTractor,
  LucideTruck,
  LucideUser,
} from "lucide-react"

export const getDriverStatusColor = (status: DriverStatusEnum) => {
  if (status == DriverStatusEnum.AVAILABLE) {
    return "bg-green-200"
  }
  if (status == DriverStatusEnum.LEAVE) {
    return "bg-yellow-200"
  }
  if (status == DriverStatusEnum.INACTIVE) {
    return "bg-red-200"
  }
  return "bg-slate-200"
}

export function GetVehicleIcon({
  vehicleType,
}: {
  vehicleType: VehicleTypesEnum
}) {
  if (vehicleType == VehicleTypesEnum.TRUCK) {
    return LucideTruck
  }
  if (vehicleType == VehicleTypesEnum.BUS) {
    return LucideBus
  }
  if (vehicleType == VehicleTypesEnum.CAR) {
    return LucideCar
  }
  if (vehicleType == VehicleTypesEnum.BIKE) {
    return LucideMotorbike
  }
  return LucideTractor
}

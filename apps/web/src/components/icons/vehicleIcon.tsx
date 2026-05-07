import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { Truck, Bus, Car, Motorbike, Tractor, LucideIcon } from "lucide-react"
import { RyogoIcon, RyogoIconSize } from "./RyogoIcon"

export default function getVehicleIcon(
  vehicleType: VehicleTypesEnum,
  size?: RyogoIconSize,
) {
  switch (vehicleType) {
    case VehicleTypesEnum.TRUCK:
      return <RyogoIcon icon={Truck} size={size ?? "sm"} />
    case VehicleTypesEnum.BUS:
      return <RyogoIcon icon={Bus} size={size ?? "sm"} />
    case VehicleTypesEnum.CAR:
      return <RyogoIcon icon={Car} size={size ?? "sm"} />
    case VehicleTypesEnum.BIKE:
      return <RyogoIcon icon={Motorbike} size={size ?? "sm"} />
    default:
      return <RyogoIcon icon={Tractor} size={size ?? "sm"} />
  }
}

export function getCanDriveIcons(canDrive: VehicleTypesEnum[]) {
  const icons: LucideIcon[] = []

  if (canDrive.includes(VehicleTypesEnum.BIKE)) {
    icons.push(Motorbike)
  }
  if (canDrive.includes(VehicleTypesEnum.CAR)) {
    icons.push(Car)
  }
  if (canDrive.includes(VehicleTypesEnum.BUS)) {
    icons.push(Bus)
  }
  if (canDrive.includes(VehicleTypesEnum.TRUCK)) {
    icons.push(Truck)
  }
  if (canDrive.includes(VehicleTypesEnum.OTHER)) {
    icons.push(Tractor)
  }
  return icons
}

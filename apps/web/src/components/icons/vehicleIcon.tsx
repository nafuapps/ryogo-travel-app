import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { Truck, Bus, Car, Motorbike, Tractor, LucideIcon } from "lucide-react"
import { RyogoIcon, RyogoIconSize } from "@/components/icons/ryogoIcon"

export default function GetVehicleIcon({
  vehicleType,
  size,
}: {
  vehicleType: VehicleTypesEnum
  size: RyogoIconSize
}) {
  switch (vehicleType) {
    case VehicleTypesEnum.TRUCK:
      return <RyogoIcon icon={Truck} size={size} />
    case VehicleTypesEnum.BUS:
      return <RyogoIcon icon={Bus} size={size} />
    case VehicleTypesEnum.CAR:
      return <RyogoIcon icon={Car} size={size} />
    case VehicleTypesEnum.BIKE:
      return <RyogoIcon icon={Motorbike} size={size} />
    default:
      return <RyogoIcon icon={Tractor} size={size} />
  }
}

export function GetCanDriveIcons({
  canDrive,
}: {
  canDrive: VehicleTypesEnum[]
}) {
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

  return (
    <div className="flex flex-row gap-1 lg:gap-1.5">
      {icons.map((Icon, index) => {
        return <RyogoIcon key={index} icon={Icon} size="sm" />
      })}
    </div>
  )
}

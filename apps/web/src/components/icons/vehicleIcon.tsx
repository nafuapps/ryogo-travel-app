import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { Truck, Bus, Car, Motorbike, Tractor, LucideIcon } from "lucide-react"
import {
  RyogoEnclosedIcon,
  RyogoIcon,
  RyogoIconType,
} from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"

export default function GetVehicleIcon({
  vehicleType,
  ...props
}: Omit<RyogoIconType, "icon"> & {
  vehicleType: VehicleTypesEnum
}) {
  switch (vehicleType) {
    case VehicleTypesEnum.TRUCK:
      return <RyogoEnclosedIcon icon={Truck} {...props} />
    case VehicleTypesEnum.BUS:
      return <RyogoEnclosedIcon icon={Bus} {...props} />
    case VehicleTypesEnum.CAR:
      return <RyogoEnclosedIcon icon={Car} {...props} />
    case VehicleTypesEnum.BIKE:
      return <RyogoEnclosedIcon icon={Motorbike} {...props} />
    default:
      return <RyogoEnclosedIcon icon={Tractor} {...props} />
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
    <SectionRowWrapper center small>
      {icons.map((icon, index) => {
        return <RyogoIcon key={index} icon={icon} size="sm" color="light" />
      })}
    </SectionRowWrapper>
  )
}

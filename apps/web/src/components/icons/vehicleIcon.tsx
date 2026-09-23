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
  let icon
  switch (vehicleType) {
    case VehicleTypesEnum.TRUCK:
      icon = Truck
      break
    case VehicleTypesEnum.BUS:
      icon = Bus
      break
    case VehicleTypesEnum.CAR:
      icon = Car
      break
    case VehicleTypesEnum.BIKE:
      icon = Motorbike
      break
    case VehicleTypesEnum.OTHER:
      icon = Tractor
      break
  }
  return <RyogoEnclosedIcon icon={icon} {...props} />
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
    <SectionRowWrapper small className="items-center justify-start">
      {icons.map((icon, index) => {
        return <RyogoIcon key={index} icon={icon} size="sm" color="light" />
      })}
    </SectionRowWrapper>
  )
}

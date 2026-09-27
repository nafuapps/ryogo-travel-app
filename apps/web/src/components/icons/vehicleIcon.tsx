import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { Truck, Bus, Car, Motorbike, Tractor, LucideIcon } from "lucide-react"
import {
  RyogoEnclosedIcon,
  RyogoIcon,
  RyogoIconType,
} from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"

export function getVehicleIcon(vehicleType: VehicleTypesEnum) {
  switch (vehicleType) {
    case VehicleTypesEnum.TRUCK:
      return Truck
    case VehicleTypesEnum.BUS:
      return Bus
    case VehicleTypesEnum.CAR:
      return Car
    case VehicleTypesEnum.BIKE:
      return Motorbike
    case VehicleTypesEnum.OTHER:
      return Tractor
  }
}

export default function GetVehicleEnclosedIcon({
  vehicleType,
  ...props
}: Omit<RyogoIconType, "icon"> & {
  vehicleType: VehicleTypesEnum
}) {
  return <RyogoEnclosedIcon icon={getVehicleIcon(vehicleType)} {...props} />
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

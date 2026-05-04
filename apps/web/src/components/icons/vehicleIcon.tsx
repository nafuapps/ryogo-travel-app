import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { Truck, Bus, Car, Motorbike, Tractor } from "lucide-react"

export default function getVehicleIcon(
  vehicleType: VehicleTypesEnum,
  size: "sm" | "md" | "lg" | "xl" = "sm",
) {
  const className = `${size === "xl" ? "size:28 lg:size-32" : size === "lg" ? "size:12 lg:size-16" : size === "md" ? "size-8 lg:size-10" : "size-4 lg:size-5"} text-slate-500`

  switch (vehicleType) {
    case VehicleTypesEnum.TRUCK:
      return <Truck className={className} />
    case VehicleTypesEnum.BUS:
      return <Bus className={className} />
    case VehicleTypesEnum.CAR:
      return <Car className={className} />
    case VehicleTypesEnum.BIKE:
      return <Motorbike className={className} />
    default:
      return <Tractor className={className} />
  }
}

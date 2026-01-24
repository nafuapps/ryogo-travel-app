import {
  PGrey,
  H5Grey,
  Caption,
  PBold,
  CaptionBold,
} from "@/components/typography"
import {
  FindVehiclesByAgencyType,
  vehicleServices,
} from "@ryogo-travel-app/api/services/vehicle.services"
import {
  LucideBus,
  LucideCar,
  LucideMotorbike,
  LucideRows3,
  LucideTractor,
  LucideTruck,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  gridClassName,
  gridItemClassName,
  iconClassName,
  sectionClassName,
  sectionHeaderClassName,
} from "../../components/pageCommons"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import Image from "next/image"
import {
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { Button } from "@/components/ui/button"

export default async function AllVehiclesListComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")
  const allVehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  return (
    <div id="AllVehiclesSection" className={sectionClassName}>
      <div id="AllVehiclesHeader" className={sectionHeaderClassName}>
        <LucideRows3 className={iconClassName} />
        <PGrey>{t("Title")}</PGrey>
        <H5Grey>{allVehicles.length}</H5Grey>
      </div>
      {allVehicles.map((vehicle) => (
        <AllVehiclesItemComponent key={vehicle.id} vehicle={vehicle} />
      ))}
      <Link href={`/dashboard/vehicles/new`} className="min-w-1/2 self-center">
        <Button variant={"default"} className="w-full">
          {t("AddVehicle")}
        </Button>
      </Link>
    </div>
  )
}

async function AllVehiclesItemComponent({
  vehicle,
}: {
  vehicle: FindVehiclesByAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")

  const bgColor = getVehicleStatusColor(vehicle.status)

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          {vehicle.vehiclePhotoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                src={getFileUrl(vehicle.vehiclePhotoUrl)}
                alt={t("Photo") + " " + vehicle.vehicleNumber}
                fill
                sizes="(max-width: 768px) 40px,48px"
              />
            </div>
          ) : (
            getVehicleIcon(vehicle.type)
          )}
        </div>
        <div className={gridItemClassName}>
          <Caption>{vehicle.brand + " " + vehicle.model}</Caption>
          <PBold>{vehicle.vehicleNumber}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{vehicle.odometerReading + t("Km")}</Caption>
          <PBold>{t("RatePerKm", { rate: vehicle.defaultRatePerKm })}</PBold>
        </div>
        <div className={gridItemClassName}>
          <div
            className={`flex justify-center items-center rounded-full ${bgColor} px-2 py-1.5 lg:px-3 lg:py-2`}
          >
            <CaptionBold>{vehicle.status.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}

const getVehicleStatusColor = (status: VehicleStatusEnum) => {
  if (status == VehicleStatusEnum.AVAILABLE) {
    return "bg-green-200"
  }
  if (status == VehicleStatusEnum.REPAIR) {
    return "bg-yellow-200"
  }
  if (status == VehicleStatusEnum.INACTIVE) {
    return "bg-red-200"
  }
  return "bg-slate-200"
}

const getVehicleIcon = (vehicleType: VehicleTypesEnum) => {
  const className = "size-8 lg:size-10 text-slate-400"
  if (vehicleType == VehicleTypesEnum.TRUCK) {
    return <LucideTruck className={className} />
  }
  if (vehicleType == VehicleTypesEnum.BUS) {
    return <LucideBus className={className} />
  }
  if (vehicleType == VehicleTypesEnum.CAR) {
    return <LucideCar className={className} />
  }
  if (vehicleType == VehicleTypesEnum.BIKE) {
    return <LucideMotorbike className={className} />
  }
  return <LucideTractor className={className} />
}

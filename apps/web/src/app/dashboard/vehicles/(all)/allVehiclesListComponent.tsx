import { SmallGrey, H5Grey, Caption, PBold } from "@/components/typography"
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
} from "@/components/page/pageCommons"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import Image from "next/image"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { Button } from "@/components/ui/button"
import { VehicleStatusPill } from "@/components/statusPills/statusPills"
import { getVehicleIcon } from "../../components/vehicles/vehicleCommon"

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
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{allVehicles.length}</H5Grey>
      </div>
      {allVehicles.map((vehicle) => (
        <AllVehiclesItemComponent key={vehicle.id} vehicle={vehicle} />
      ))}
      <Link
        href={`/dashboard/vehicles/new`}
        className="w-full md:w-1/2 self-center"
      >
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
  const IconComponent = getVehicleIcon(vehicle.type)

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          {vehicle.vehiclePhotoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                loading="eager"
                src={getFileUrl(vehicle.vehiclePhotoUrl)}
                alt={t("Photo") + " " + vehicle.vehicleNumber}
                fill
                sizes="(max-width: 1024px) 40px,48px"
              />
            </div>
          ) : (
            <IconComponent className="size-8 lg:size-10 text-slate-400" />
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
          <VehicleStatusPill status={vehicle.status} />
        </div>
      </div>
    </Link>
  )
}

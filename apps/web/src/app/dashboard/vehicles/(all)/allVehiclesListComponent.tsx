import { SmallGrey, H5Grey, Caption, PBold } from "@/components/typography"
import {
  FindVehiclesByAgencyType,
  vehicleServices,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { LucideRows3, Plus } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { VehicleStatusPill } from "@/components/statusPills/statusPills"
import getVehicleIcon from "@/components/icons/vehicleIcon"

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
        <Link href={`/dashboard/vehicles/new`} className="ml-auto">
          <Button variant={"outline"}>
            <Plus className="size-4 md:size-5 text-slate-700" />
            {t("AddVehicle")}
          </Button>
        </Link>
      </div>
      {allVehicles.map((vehicle) => (
        <AllVehiclesItemComponent key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}

async function AllVehiclesItemComponent({
  vehicle,
}: {
  vehicle: FindVehiclesByAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")

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
            getVehicleIcon(vehicle.type, "md")
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

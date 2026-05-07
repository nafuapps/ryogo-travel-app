import { SmallGrey, H5Grey, Caption, PBold } from "@/components/typography"
import {
  FindVehiclesByAgencyType,
  vehicleServices,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { Rows3, Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Button } from "@/components/ui/button"
import { VehicleStatusPill } from "@/components/statusPills/statusPills"
import getVehicleIcon from "@/components/icons/vehicleIcon"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default async function AllVehiclesListComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")
  const allVehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  return (
    <SectionWrapper id="AllVehiclesSection">
      <SectionHeaderWrapper>
        <RyogoIcon icon={Rows3} size="sm" />
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{allVehicles.length}</H5Grey>
        <Link href={`/dashboard/vehicles/new`} className="ml-auto">
          <Button variant={"outline"}>
            <Plus className="size-4 md:size-5 text-slate-700" />
            {t("AddVehicle")}
          </Button>
        </Link>
      </SectionHeaderWrapper>
      {allVehicles.map((vehicle) => (
        <AllVehiclesItemComponent key={vehicle.id} vehicle={vehicle} />
      ))}
    </SectionWrapper>
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
      <GridWrapper>
        <GridItemWrapper>
          {vehicle.vehiclePhotoUrl ? (
            <RyogoImage
              src={getFileUrl(vehicle.vehiclePhotoUrl)}
              alt={t("Photo") + " " + vehicle.vehicleNumber}
              imageSize="sm"
            />
          ) : (
            getVehicleIcon(vehicle.type, "md")
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{vehicle.brand + " " + vehicle.model}</Caption>
          <PBold>{vehicle.vehicleNumber}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{vehicle.odometerReading + t("Km")}</Caption>
          <PBold>{t("RatePerKm", { rate: vehicle.defaultRatePerKm })}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <VehicleStatusPill status={vehicle.status} />
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

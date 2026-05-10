import {
  RyogoSmall,
  RyogoH4,
  RyogoCaption,
  RyogoP,
} from "@/components/typography"
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
import { RyogoIcon } from "@/components/icons/ryogoIcon"

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
        <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        <RyogoH4 color="slate"> {allVehicles.length}</RyogoH4>
        <Link href={`/dashboard/vehicles/new`} className="ml-auto">
          <Button variant={"outline"}>
            <RyogoIcon icon={Plus} size="sm" />
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
          <RyogoCaption color="slate">
            {vehicle.brand + " " + vehicle.model}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {vehicle.vehicleNumber}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {vehicle.odometerReading + t("Km")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {t("RatePerKm", { rate: vehicle.defaultRatePerKm })}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <VehicleStatusPill status={vehicle.status} />
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

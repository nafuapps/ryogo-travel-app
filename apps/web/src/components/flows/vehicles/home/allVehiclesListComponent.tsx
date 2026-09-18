import { RyogoSmall, RyogoCaption, RyogoP } from "@/components/typography"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { Rows3, Plus, ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { VehicleStatusPill } from "@/components/pills/ryogoPills"
import GetVehicleIcon from "@/components/icons/vehicleIcon"
import {
  AddInfoWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import VehicleColorBox from "@/components/flows/vehicles/vehicleColorBox"

export default async function AllVehiclesListComponent({
  allVehicles,
}: {
  allVehicles: FindVehiclesByAgencyType
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")

  return (
    <SectionWrapper id="AllVehiclesSection">
      <SectionRowWrapper className="items-center">
        <RyogoIcon icon={Rows3} size="sm" color="light" />
        <RyogoSmall color="light">{t("Title")}</RyogoSmall>
        <RyogoSmall color="light" weight="font-bold">
          {allVehicles.length}
        </RyogoSmall>
      </SectionRowWrapper>
      <TileGridWrapper>
        {allVehicles.map((vehicle) => (
          <VehicleItemComponent key={vehicle.id} vehicle={vehicle} />
        ))}
        <Link href={`/dashboard/vehicles/new`} className="w-full">
          <AddInfoWrapper
            icon={Plus}
            label={t("AddVehicle")}
            className="h-full"
          />
        </Link>
      </TileGridWrapper>
    </SectionWrapper>
  )
}

async function VehicleItemComponent({
  vehicle,
}: {
  vehicle: FindVehiclesByAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Vehicles.All")

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
      <SectionRowWrapper className="items-center h-full p-4 lg:p-5 border transition hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
        {vehicle.vehiclePhotoUrl ? (
          <RyogoImage
            src={getFileUrl(vehicle.vehiclePhotoUrl)}
            alt={vehicle.vehicleNumber}
            imageSize="md"
          />
        ) : (
          <GetVehicleIcon vehicleType={vehicle.type} size="lg" />
        )}
        <SectionColWrapper small className="w-full">
          <RyogoP weight="font-bold"> {vehicle.vehicleNumber}</RyogoP>
          <RyogoCaption color="light" weight="font-bold">
            {vehicle.brand + " " + vehicle.model}
          </RyogoCaption>
          <SectionRowWrapper className="items-center">
            <RyogoCaption color="light">
              {vehicle.odometerReading + t("Km")}
            </RyogoCaption>
            <VehicleColorBox color={vehicle.color} />
          </SectionRowWrapper>
        </SectionColWrapper>
        <SectionColWrapper className="items-end">
          <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
          <RyogoCaption color="light">
            {t("RatePerKm", { rate: vehicle.defaultRatePerKm })}
          </RyogoCaption>
          <VehicleStatusPill status={vehicle.status} />
        </SectionColWrapper>
      </SectionRowWrapper>
    </Link>
  )
}

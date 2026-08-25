import {
  vehicleServices,
  FindDashboardVehiclesType,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { getTranslations } from "next-intl/server"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { DashboardLabelImageChip } from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import GetVehicleIcon from "@/components/icons/vehicleIcon"

export default async function DashboardVehiclesComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.Vehicles")

  const vehicles = await vehicleServices.findDashboardVehicles(agencyId)

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === VehicleStatusEnum.AVAILABLE,
  )
  const onTripVehicles = vehicles.filter(
    (vehicle) => vehicle.status === VehicleStatusEnum.ON_TRIP,
  )
  const repairVehicles = vehicles.filter(
    (vehicle) => vehicle.status === VehicleStatusEnum.REPAIR,
  )
  const inactiveVehicles = vehicles.filter(
    (vehicle) => vehicle.status === VehicleStatusEnum.INACTIVE,
  )

  return (
    <SectionWrapper id="DashboardTrips">
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Available")}</RyogoCaption>
        <RyogoCaption color="light">{availableVehicles.length}</RyogoCaption>
      </SectionRowWrapper>
      {availableVehicles.map((vehicle, index) => (
        <DashboardVehicleChipComponent
          key={index}
          vehicle={vehicle}
          type="available"
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("OnTrip")}</RyogoCaption>
        <RyogoCaption color="light">{onTripVehicles.length}</RyogoCaption>
      </SectionRowWrapper>
      {onTripVehicles.map((vehicle, index) => (
        <DashboardVehicleChipComponent
          key={index}
          vehicle={vehicle}
          type="onTrip"
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Repair")}</RyogoCaption>
        <RyogoCaption color="light">{repairVehicles.length}</RyogoCaption>
      </SectionRowWrapper>
      {repairVehicles.map((vehicle, index) => (
        <DashboardVehicleChipComponent
          key={index}
          vehicle={vehicle}
          type="repair"
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Inactive")}</RyogoCaption>
        <RyogoCaption color="light">{inactiveVehicles.length}</RyogoCaption>
      </SectionRowWrapper>
      {inactiveVehicles.map((vehicle, index) => (
        <DashboardVehicleChipComponent
          key={index}
          vehicle={vehicle}
          type="inactive"
        />
      ))}
    </SectionWrapper>
  )
}

function DashboardVehicleChipComponent({
  vehicle,
  type,
}: {
  vehicle: FindDashboardVehiclesType[number]
  type: "available" | "onTrip" | "repair" | "inactive"
}) {
  const vehicleImageUrl = vehicle.vehiclePhotoUrl

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`} className="flex">
      <div
        className={`flex flex-row justify-between gap-1 lg:gap-1.5 w-full border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 lg:p-2`}
      >
        <DashboardLabelImageChip label={vehicle.vehicleNumber}>
          {vehicleImageUrl ? (
            <RyogoImage
              src={getFileUrl(vehicleImageUrl)}
              alt={vehicle.vehicleNumber}
              imageSize="xs"
            />
          ) : (
            <GetVehicleIcon vehicleType={vehicle.type} size="sm" />
          )}
        </DashboardLabelImageChip>
      </div>
    </Link>
  )
}

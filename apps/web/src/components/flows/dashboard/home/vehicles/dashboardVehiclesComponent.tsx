import {
  vehicleServices,
  FindDashboardVehiclesType,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { getTranslations } from "next-intl/server"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import { RyogoCaption } from "@/components/typography"
import {
  DashboardItemWrapper,
  DashboardLabelImageChip,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import GetVehicleIcon from "@/components/icons/vehicleIcon"
import { Route } from "next"

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
    <SectionWrapper id="DashboardVehicles">
      <DashboardSectionHeader title={t("Title")} />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Available")}</RyogoCaption>
        <RyogoCaption color="light">{availableVehicles.length}</RyogoCaption>
      </SectionRowWrapper>
      {availableVehicles.length > 0 && (
        <SectionColWrapper small>
          {availableVehicles.map((vehicle, index) => (
            <DashboardVehicleChipComponent
              key={index}
              vehicle={vehicle}
              type="available"
            />
          ))}
        </SectionColWrapper>
      )}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("OnTrip")}</RyogoCaption>
        <RyogoCaption color="light">{onTripVehicles.length}</RyogoCaption>
      </SectionRowWrapper>
      {onTripVehicles.length > 0 && (
        <SectionColWrapper small>
          {onTripVehicles.map((vehicle, index) => (
            <DashboardVehicleChipComponent
              key={index}
              vehicle={vehicle}
              type="onTrip"
            />
          ))}
        </SectionColWrapper>
      )}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Repair")}</RyogoCaption>
        <RyogoCaption color="light">{repairVehicles.length}</RyogoCaption>
      </SectionRowWrapper>
      {repairVehicles.length > 0 && (
        <SectionColWrapper small>
          {repairVehicles.map((vehicle, index) => (
            <DashboardVehicleChipComponent
              key={index}
              vehicle={vehicle}
              type="repair"
            />
          ))}
        </SectionColWrapper>
      )}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Inactive")}</RyogoCaption>
        <RyogoCaption color="light">{inactiveVehicles.length}</RyogoCaption>
      </SectionRowWrapper>
      {inactiveVehicles.length > 0 && (
        <SectionColWrapper small>
          {inactiveVehicles.map((vehicle, index) => (
            <DashboardVehicleChipComponent
              key={index}
              vehicle={vehicle}
              type="inactive"
            />
          ))}
        </SectionColWrapper>
      )}
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
    <DashboardItemWrapper href={`/dashboard/vehicles/${vehicle.id}` as Route}>
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
      <RyogoCaption color="light" weight="font-bold">
        {vehicle.brand + " " + vehicle.model}
      </RyogoCaption>
    </DashboardItemWrapper>
  )
}

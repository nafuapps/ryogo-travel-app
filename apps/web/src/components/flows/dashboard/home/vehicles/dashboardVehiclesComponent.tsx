import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { getTranslations } from "next-intl/server"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionColWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import {
  DashboardRowHeader,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import DashboardVehicleChipComponent from "./dashboardVehicleChipComponent"

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
      <DashboardSectionHeader title={t("Title")} href={"/dashboard/vehicles"} />
      <DashboardRowHeader
        title={t("Available")}
        count={availableVehicles.length}
      />
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
      <DashboardRowHeader title={t("OnTrip")} count={onTripVehicles.length} />
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
      <DashboardRowHeader title={t("Repair")} count={repairVehicles.length} />
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
      <DashboardRowHeader
        title={t("Inactive")}
        count={inactiveVehicles.length}
      />
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

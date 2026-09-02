import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { getTranslations } from "next-intl/server"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import { SectionWrapper } from "@/components/page/pageWrappers"
import {
  DashboardRow,
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

  if (vehicles.length === 0) {
    return null
  }

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
      {availableVehicles.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("Available")}
            count={availableVehicles.length}
          />
          {availableVehicles.map((vehicle, index) => (
            <DashboardVehicleChipComponent
              key={index}
              vehicle={vehicle}
              type="available"
            />
          ))}
        </DashboardRow>
      )}
      {onTripVehicles.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("OnTrip")}
            count={onTripVehicles.length}
          />
          {onTripVehicles.map((vehicle, index) => (
            <DashboardVehicleChipComponent
              key={index}
              vehicle={vehicle}
              type="onTrip"
            />
          ))}
        </DashboardRow>
      )}
      {repairVehicles.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("Repair")}
            count={repairVehicles.length}
          />
          {repairVehicles.map((vehicle, index) => (
            <DashboardVehicleChipComponent
              key={index}
              vehicle={vehicle}
              type="repair"
            />
          ))}
        </DashboardRow>
      )}
      {inactiveVehicles.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("Inactive")}
            count={inactiveVehicles.length}
          />
          {inactiveVehicles.map((vehicle, index) => (
            <DashboardVehicleChipComponent
              key={index}
              vehicle={vehicle}
              type="inactive"
            />
          ))}
        </DashboardRow>
      )}
    </SectionWrapper>
  )
}

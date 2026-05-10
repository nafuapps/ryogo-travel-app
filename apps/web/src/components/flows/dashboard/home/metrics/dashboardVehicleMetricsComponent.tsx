import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { Car } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  DashboardMetricWrapper,
  DashboardMetricTopWrapper,
  DashboardMetricHeader,
  DashboardMetricMain,
  DashboardMetricSubTitle,
  DashboardMetricGridItem,
  DashboardMetricGridWrapper,
} from "./dashboardMetricsWrappers"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function DashboardVehicleMetricsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.VehicleMetrics")

  const vehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  const totalVehicles = vehicles.length
  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === VehicleStatusEnum.AVAILABLE,
  ).length
  const onTripVehicles = vehicles.filter(
    (vehicle) => vehicle.status === VehicleStatusEnum.ON_TRIP,
  ).length
  const repairVehicles = vehicles.filter(
    (vehicle) => vehicle.status === VehicleStatusEnum.REPAIR,
  ).length
  const inactiveVehicles = vehicles.filter(
    (vehicle) => vehicle.status === VehicleStatusEnum.INACTIVE,
  ).length

  return (
    <DashboardMetricWrapper>
      <DashboardMetricTopWrapper>
        <DashboardMetricHeader label={t("Title")} icon={Car} />
        <DashboardMetricMain mainValue={totalVehicles}>
          {totalVehicles !== 0 && (
            <DashboardMetricSubTitle
              subtitle={t("Subtitle", {
                rate: (onTripVehicles / totalVehicles).toLocaleString("en-IN", {
                  style: "percent",
                  maximumFractionDigits: 1,
                }),
              })}
            />
          )}
        </DashboardMetricMain>
      </DashboardMetricTopWrapper>
      <DashboardMetricGridWrapper>
        <DashboardMetricGridItem
          label={t("Available")}
          value={availableVehicles}
          borderBottom
        />
        <DashboardMetricGridItem
          label={t("InTrip")}
          value={onTripVehicles}
          borderLeft
          borderBottom
        />
        <DashboardMetricGridItem label={t("Repair")} value={repairVehicles} />
        <DashboardMetricGridItem
          label={t("Inactive")}
          value={inactiveVehicles}
          borderLeft
        />
      </DashboardMetricGridWrapper>
    </DashboardMetricWrapper>
  )
}

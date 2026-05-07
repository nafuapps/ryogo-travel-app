import {
  RyogoH3,
  RyogoH2,
  RyogoCaption,
  RyogoSmall,
} from "@/components/typography"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { Car } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  metricsClassName,
  metricFirstRowClassName,
  metricMainClassName,
  metricHeaderClassName,
  metricItem1ClassName,
  metricSecondRowClassName,
  metricItem4ClassName,
  metricItem3ClassName,
  metricItem2ClassName,
} from "./dashboardMetricsCommons"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

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
    <div id="dashboardVehicleMetrics" className={metricsClassName}>
      <div
        id="dashboardVehicleMetricsFirstCol"
        className={metricFirstRowClassName}
      >
        <div
          id="dashboardVehicleMetricsHeader"
          className={metricHeaderClassName}
        >
          <RyogoIcon icon={Car} size="sm" />
          <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        </div>
        <div className={metricMainClassName}>
          <RyogoH2>{totalVehicles}</RyogoH2>
          {totalVehicles !== 0 && (
            <RyogoCaption color="light">
              {(onTripVehicles / totalVehicles).toLocaleString("en-IN", {
                style: "percent",
                maximumFractionDigits: 1,
              }) +
                " " +
                t("Rate")}
            </RyogoCaption>
          )}
        </div>
      </div>
      <div
        id="dashboardVehicleMetricsSecondCol"
        className={metricSecondRowClassName}
      >
        <div
          id="dashboardVehicleMetricsAvailable"
          className={metricItem1ClassName}
        >
          <RyogoH3>{availableVehicles}</RyogoH3>
          <RyogoCaption color="light">{t("Available")}</RyogoCaption>
        </div>
        <div
          id="dashboardVehicleMetricsInTrip"
          className={metricItem2ClassName}
        >
          <RyogoH3>{onTripVehicles}</RyogoH3>
          <RyogoCaption color="light">{t("InTrip")}</RyogoCaption>
        </div>
        <div
          id="dashboardVehicleMetricsCancelled"
          className={metricItem3ClassName}
        >
          <RyogoH3>{inactiveVehicles}</RyogoH3>
          <RyogoCaption color="light">{t("Inactive")}</RyogoCaption>
        </div>
        <div
          id="dashboardVehicleMetricsCompleted"
          className={metricItem4ClassName}
        >
          <RyogoH3>{repairVehicles}</RyogoH3>
          <RyogoCaption color="light">{t("Repair")}</RyogoCaption>
        </div>
      </div>
    </div>
  )
}

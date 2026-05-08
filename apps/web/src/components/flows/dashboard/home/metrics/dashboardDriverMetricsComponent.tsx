import {
  RyogoH3,
  RyogoCaption,
  RyogoSmall,
  RyogoH2,
} from "@/components/typography"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { LifeBuoy } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  metricFirstRowClassName,
  metricHeaderClassName,
  metricItem1ClassName,
  metricItem2ClassName,
  metricItem3ClassName,
  metricItem4ClassName,
  metricMainClassName,
  metricsClassName,
  metricSecondRowClassName,
} from "./dashboardMetricsCommons"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function DashboardDriverMetricsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.DriverMetrics")

  const drivers = await driverServices.findDriversByAgency(agencyId)

  const totalDrivers = drivers.length
  const availableDrivers = drivers.filter(
    (driver) => driver.status === DriverStatusEnum.AVAILABLE,
  ).length
  const onTripDrivers = drivers.filter(
    (driver) => driver.status === DriverStatusEnum.ON_TRIP,
  ).length
  const leaveDrivers = drivers.filter(
    (driver) => driver.status === DriverStatusEnum.LEAVE,
  ).length
  const inactiveDrivers = drivers.filter(
    (driver) => driver.status === DriverStatusEnum.INACTIVE,
  ).length

  return (
    <div id="dashboardDriverMetrics" className={metricsClassName}>
      <div
        id="dashboardDriverMetricsFirstCol"
        className={metricFirstRowClassName}
      >
        <div
          id="dashboardVehicleMetricsHeader"
          className={metricHeaderClassName}
        >
          <RyogoIcon icon={LifeBuoy} size="sm" />
          <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        </div>
        <div className={metricMainClassName}>
          <RyogoH2>{totalDrivers}</RyogoH2>
          {totalDrivers !== 0 && (
            <RyogoCaption color="light">
              {(onTripDrivers / totalDrivers).toLocaleString("en-IN", {
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
        id="dashboardDriverMetricsSecondCol"
        className={metricSecondRowClassName}
      >
        <div
          id="dashboardDriverMetricsAvailable"
          className={metricItem1ClassName}
        >
          <RyogoH3>{availableDrivers}</RyogoH3>
          <RyogoCaption color="light">{t("Available")}</RyogoCaption>
        </div>
        <div id="dashboardDriverMetricsInTrip" className={metricItem2ClassName}>
          <RyogoH3>{onTripDrivers}</RyogoH3>
          <RyogoCaption color="light">{t("InTrip")}</RyogoCaption>
        </div>
        <div
          id="dashboardDriverMetricsCancelled"
          className={metricItem3ClassName}
        >
          <RyogoH3>{inactiveDrivers}</RyogoH3>
          <RyogoCaption color="light">{t("Inactive")}</RyogoCaption>
        </div>
        <div
          id="dashboardDriverMetricsCompleted"
          className={metricItem4ClassName}
        >
          <RyogoH3>{leaveDrivers}</RyogoH3>
          <RyogoCaption color="light">{t("Leave")}</RyogoCaption>
        </div>
      </div>
    </div>
  )
}

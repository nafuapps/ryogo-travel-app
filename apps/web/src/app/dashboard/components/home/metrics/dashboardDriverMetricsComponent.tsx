import { H4, CaptionGrey, H1, PGrey } from "@/components/typography"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { LucideLifeBuoy } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  metricFirstColClassName,
  metricHeaderClassName,
  metricItem1ClassName,
  metricItem2ClassName,
  metricItem3ClassName,
  metricItem4ClassName,
  metricMainClassName,
  metricsClassName,
  metricSecondColClassName,
  iconClassName,
} from "./dashboardMetricsCommons"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"

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
        className={metricFirstColClassName}
      >
        <div
          id="dashboardVehicleMetricsHeader"
          className={metricHeaderClassName}
        >
          <LucideLifeBuoy className={iconClassName} />
          <PGrey>{t("Title")}</PGrey>
        </div>
        <div className={metricMainClassName}>
          <H1>{totalDrivers}</H1>
          <CaptionGrey>
            {(onTripDrivers / totalDrivers).toLocaleString("en-IN", {
              style: "percent",
              maximumFractionDigits: 1,
            }) +
              " " +
              t("Rate")}
          </CaptionGrey>
        </div>
      </div>
      <div
        id="dashboardDriverMetricsSecondCol"
        className={metricSecondColClassName}
      >
        <div
          id="dashboardDriverMetricsAvailable"
          className={metricItem1ClassName}
        >
          <H4>{availableDrivers}</H4>
          <CaptionGrey>{t("Available")}</CaptionGrey>
        </div>
        <div id="dashboardDriverMetricsInTrip" className={metricItem2ClassName}>
          <H4>{onTripDrivers}</H4>
          <CaptionGrey>{t("InTrip")}</CaptionGrey>
        </div>
        <div
          id="dashboardDriverMetricsCancelled"
          className={metricItem3ClassName}
        >
          <H4>{inactiveDrivers}</H4>
          <CaptionGrey>{t("Inactive")}</CaptionGrey>
        </div>
        <div
          id="dashboardDriverMetricsCompleted"
          className={metricItem4ClassName}
        >
          <H4>{leaveDrivers}</H4>
          <CaptionGrey>{t("Leave")}</CaptionGrey>
        </div>
      </div>
    </div>
  )
}

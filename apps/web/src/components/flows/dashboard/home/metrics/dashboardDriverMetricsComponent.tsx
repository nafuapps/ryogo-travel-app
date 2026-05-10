import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { LifeBuoy } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  DashboardMetricGridItem,
  DashboardMetricGridWrapper,
  DashboardMetricHeader,
  DashboardMetricMain,
  DashboardMetricSubTitle,
  DashboardMetricTopWrapper,
  DashboardMetricWrapper,
} from "./dashboardMetricsWrappers"
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
    <DashboardMetricWrapper>
      <DashboardMetricTopWrapper>
        <DashboardMetricHeader label={t("Title")} icon={LifeBuoy} />
        <DashboardMetricMain mainValue={totalDrivers}>
          {totalDrivers !== 0 && (
            <DashboardMetricSubTitle
              subtitle={t("Subtitle", {
                rate: (onTripDrivers / totalDrivers).toLocaleString("en-IN", {
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
          value={availableDrivers}
          borderBottom
        />
        <DashboardMetricGridItem
          label={t("InTrip")}
          value={onTripDrivers}
          borderLeft
          borderBottom
        />
        <DashboardMetricGridItem label={t("Leave")} value={leaveDrivers} />
        <DashboardMetricGridItem
          label={t("Inactive")}
          value={inactiveDrivers}
          borderLeft
        />
      </DashboardMetricGridWrapper>
    </DashboardMetricWrapper>
  )
}

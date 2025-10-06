import { H4, CaptionGrey, H1, PGrey } from "@/components/typography";
import { getCurrentUser } from "@/lib/auth";
import { driverServices } from "@ryogo-travel-app/api/services/driver.services";
import { LucideLifeBuoy } from "lucide-react";
import { getTranslations } from "next-intl/server";
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
} from "./dashboardMetricsCommons";

export default async function DashboardDriverMetricsComponent() {
  const t = await getTranslations("Dashboard.Home.DriverMetrics");
  const user = await getCurrentUser();

  // const drivers = await driverServices.getAllDrivers(user!.agencyId);

  // const totalDrivers = drivers.length;
  // const availableDrivers = drivers.filter(
  //   (driver) => driver.status === "available"
  // ).length;
  // const onTripDrivers = drivers.filter(
  //   (driver) => driver.status === "on_trip"
  // ).length;
  // const leaveDrivers = drivers.filter(
  //   (driver) => driver.status === "leave"
  // ).length;
  // const inactiveDrivers = drivers.filter(
  //   (driver) => driver.status === "inactive"
  // ).length;

  const totalDrivers = 8;
  const availableDrivers = 3;
  const onTripDrivers = 3;
  const leaveDrivers = 1;
  const inactiveDrivers = 1;

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
            {(availableDrivers / totalDrivers).toLocaleString("en-IN", {
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
  );
}

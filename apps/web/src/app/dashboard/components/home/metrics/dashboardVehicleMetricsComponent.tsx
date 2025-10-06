import { H4, H1, CaptionGrey, PGrey } from "@/components/typography";
import { getCurrentUser } from "@/lib/auth";
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services";
import { LucideCar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  metricsClassName,
  metricFirstColClassName,
  metricMainClassName,
  metricHeaderClassName,
  metricItem1ClassName,
  metricSecondColClassName,
  metricItem4ClassName,
  metricItem3ClassName,
  metricItem2ClassName,
  iconClassName,
} from "./dashboardMetricsCommons";

export default async function DashboardVehicleMetricsComponent() {
  const t = await getTranslations("Dashboard.Home.VehicleMetrics");
  const user = await getCurrentUser();

  // const vehicles = await vehicleServices.getAllVehicles(user!.agencyId);

  // const totalVehicles = vehicles.length;
  // const availableVehicles = vehicles.filter(
  //   (vehicle) => vehicle.status === "available"
  // ).length;
  // const onTripVehicles = vehicles.filter(
  //   (vehicle) => vehicle.status === "on_trip"
  // ).length;
  // const repairVehicles = vehicles.filter(
  //   (vehicle) => vehicle.status === "repair"
  // ).length;
  // const inactiveVehicles = vehicles.filter(
  //   (vehicle) => vehicle.status === "inactive"
  // ).length;

  const totalVehicles = 8;
  const availableVehicles = 3;
  const onTripVehicles = 3;
  const repairVehicles = 1;
  const inactiveVehicles = 1;

  return (
    <div id="dashboardVehicleMetrics" className={metricsClassName}>
      <div
        id="dashboardVehicleMetricsFirstCol"
        className={metricFirstColClassName}
      >
        <div
          id="dashboardVehicleMetricsHeader"
          className={metricHeaderClassName}
        >
          <LucideCar className={iconClassName} />
          <PGrey>{t("Title")}</PGrey>
        </div>
        <div className={metricMainClassName}>
          <H1>{totalVehicles}</H1>
          <CaptionGrey>
            {(availableVehicles / totalVehicles).toLocaleString("en-IN", {
              style: "percent",
              maximumFractionDigits: 1,
            }) +
              " " +
              t("Rate")}
          </CaptionGrey>
        </div>
      </div>
      <div
        id="dashboardVehicleMetricsSecondCol"
        className={metricSecondColClassName}
      >
        <div
          id="dashboardVehicleMetricsAvailable"
          className={metricItem1ClassName}
        >
          <H4>{availableVehicles}</H4>
          <CaptionGrey>{t("Available")}</CaptionGrey>
        </div>
        <div
          id="dashboardVehicleMetricsInTrip"
          className={metricItem2ClassName}
        >
          <H4>{onTripVehicles}</H4>
          <CaptionGrey>{t("InTrip")}</CaptionGrey>
        </div>
        <div
          id="dashboardVehicleMetricsCancelled"
          className={metricItem3ClassName}
        >
          <H4>{inactiveVehicles}</H4>
          <CaptionGrey>{t("Inactive")}</CaptionGrey>
        </div>
        <div
          id="dashboardVehicleMetricsCompleted"
          className={metricItem4ClassName}
        >
          <H4>{repairVehicles}</H4>
          <CaptionGrey>{t("Repair")}</CaptionGrey>
        </div>
      </div>
    </div>
  );
}

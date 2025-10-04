import { H4, H1, CaptionGrey, PGrey } from "@/components/typography";
import { getCurrentUser } from "@/lib/auth";
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services";
import { LucideCar } from "lucide-react";
import { getTranslations } from "next-intl/server";

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
    <div
      id="dashboardVehicleMetrics"
      className="bg-white rounded-lg grid grid-cols-3 p-4 lg:p-5 gap-1 lg:gap-2"
    >
      <div
        id="dashboardVehicleMetricsFirstCol"
        className="flex flex-col justify-start items-center gap-4 lg:gap-5"
      >
        <div
          id="dashboardVehicleMetricsHeader"
          className="flex flex-row gap-2 items-center self-start"
        >
          <LucideCar className="text-slate-500 size-4 lg:size-5" />
          <PGrey>{t("Title")}</PGrey>
        </div>
        <H1>{totalVehicles}</H1>
      </div>
      <div
        id="dashboardVehicleMetricsSecondCol"
        className="grid grid-cols-2 grid-row-2 col-span-2"
      >
        <div
          id="dashboardVehicleMetricsAvailable"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-r border-slate-100"
        >
          <H4>{availableVehicles}</H4>
          <CaptionGrey>{t("Available")}</CaptionGrey>
        </div>
        <div
          id="dashboardVehicleMetricsInTrip"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center"
        >
          <H4>{onTripVehicles}</H4>
          <CaptionGrey>{t("InTrip")}</CaptionGrey>
        </div>
        <div
          id="dashboardVehicleMetricsCancelled"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-t border-r border-slate-100"
        >
          <H4>{inactiveVehicles}</H4>
          <CaptionGrey>{t("Inactive")}</CaptionGrey>
        </div>
        <div
          id="dashboardVehicleMetricsCompleted"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-t border-slate-100"
        >
          <H4>{repairVehicles}</H4>
          <CaptionGrey>{t("Repair")}</CaptionGrey>
        </div>
      </div>
    </div>
  );
}

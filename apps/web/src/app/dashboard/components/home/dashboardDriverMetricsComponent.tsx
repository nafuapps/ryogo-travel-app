import { H4, CaptionGrey, H1, PGrey } from "@/components/typography";
import { getCurrentUser } from "@/lib/auth";
import { driverServices } from "@ryogo-travel-app/api/services/driver.services";
import { LucideLifeBuoy } from "lucide-react";
import { getTranslations } from "next-intl/server";

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
    <div
      id="dashboardDriverMetrics"
      className="bg-white rounded-lg grid grid-cols-3 p-4 lg:p-5 gap-1 lg:gap-2"
    >
      <div
        id="dashboardDriverMetricsFirstCol"
        className="flex flex-col justify-start items-center gap-4 lg:gap-5"
      >
        <div
          id="dashboardVehicleMetricsHeader"
          className="flex flex-row gap-2 items-center self-start"
        >
          <LucideLifeBuoy className="text-slate-500 size-4 lg:size-5" />
          <PGrey>{t("Title")}</PGrey>
        </div>
        <H1>{totalDrivers}</H1>
      </div>
      <div
        id="dashboardDriverMetricsSecondCol"
        className="grid grid-rows-2 grid-cols-2 col-span-2"
      >
        <div
          id="dashboardDriverMetricsAvailable"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-r border-slate-100"
        >
          <H4>{availableDrivers}</H4>
          <CaptionGrey>{t("Available")}</CaptionGrey>
        </div>
        <div
          id="dashboardDriverMetricsInTrip"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center"
        >
          <H4>{onTripDrivers}</H4>
          <CaptionGrey>{t("InTrip")}</CaptionGrey>
        </div>
        <div
          id="dashboardDriverMetricsCancelled"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-t border-r border-slate-100"
        >
          <H4>{inactiveDrivers}</H4>
          <CaptionGrey>{t("Inactive")}</CaptionGrey>
        </div>
        <div
          id="dashboardDriverMetricsCompleted"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-t border-slate-100"
        >
          <H4>{leaveDrivers}</H4>
          <CaptionGrey>{t("Leave")}</CaptionGrey>
        </div>
      </div>
    </div>
  );
}

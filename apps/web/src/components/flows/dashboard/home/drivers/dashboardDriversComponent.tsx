import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionColWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import {
  DashboardRowHeader,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import DashboardDriverChipComponent from "./dashboardDriverChipComponent"

export default async function DashboardDriversComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.Drivers")

  const drivers = await driverServices.findDashboardDrivers(agencyId)

  const availableDrivers = drivers.filter(
    (driver) => driver.status === DriverStatusEnum.AVAILABLE,
  )
  const onTripDrivers = drivers.filter(
    (driver) => driver.status === DriverStatusEnum.ON_TRIP,
  )
  const leaveDrivers = drivers.filter(
    (driver) => driver.status === DriverStatusEnum.LEAVE,
  )
  const inactiveDrivers = drivers.filter(
    (driver) => driver.status === DriverStatusEnum.INACTIVE,
  )

  return (
    <SectionWrapper id="DashboardDrivers">
      <DashboardSectionHeader title={t("Title")} href={"/dashboard/drivers"} />
      <DashboardRowHeader
        title={t("Available")}
        count={availableDrivers.length}
      />
      {availableDrivers.length > 0 && (
        <SectionColWrapper small>
          {availableDrivers.map((driver, index) => (
            <DashboardDriverChipComponent
              key={index}
              driver={driver}
              type="available"
            />
          ))}
        </SectionColWrapper>
      )}
      <Separator />
      <DashboardRowHeader title={t("OnTrip")} count={onTripDrivers.length} />
      {onTripDrivers.length > 0 && (
        <SectionColWrapper small>
          {onTripDrivers.map((driver, index) => (
            <DashboardDriverChipComponent
              key={index}
              driver={driver}
              type="onTrip"
            />
          ))}
        </SectionColWrapper>
      )}
      <Separator />
      <DashboardRowHeader title={t("Leave")} count={leaveDrivers.length} />
      {leaveDrivers.length > 0 && (
        <SectionColWrapper small>
          {leaveDrivers.map((driver, index) => (
            <DashboardDriverChipComponent
              key={index}
              driver={driver}
              type="leave"
            />
          ))}
        </SectionColWrapper>
      )}
      <Separator />
      <DashboardRowHeader
        title={t("Inactive")}
        count={inactiveDrivers.length}
      />
      {inactiveDrivers.length > 0 && (
        <SectionColWrapper small>
          {inactiveDrivers.map((driver, index) => (
            <DashboardDriverChipComponent
              key={index}
              driver={driver}
              type="inactive"
            />
          ))}
        </SectionColWrapper>
      )}
    </SectionWrapper>
  )
}

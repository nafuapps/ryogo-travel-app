import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { SectionWrapper } from "@/components/page/pageWrappers"
import {
  DashboardRow,
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

  if (drivers.length === 0) {
    return null
  }

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
      {availableDrivers.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("Available")}
            count={availableDrivers.length}
          />
          {availableDrivers.map((driver, index) => (
            <DashboardDriverChipComponent
              key={index}
              driver={driver}
              type="available"
            />
          ))}
        </DashboardRow>
      )}
      {onTripDrivers.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("OnTrip")}
            count={onTripDrivers.length}
          />
          {onTripDrivers.map((driver, index) => (
            <DashboardDriverChipComponent
              key={index}
              driver={driver}
              type="onTrip"
            />
          ))}
        </DashboardRow>
      )}
      {leaveDrivers.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader title={t("Leave")} count={leaveDrivers.length} />
          {leaveDrivers.map((driver, index) => (
            <DashboardDriverChipComponent
              key={index}
              driver={driver}
              type="leave"
            />
          ))}
        </DashboardRow>
      )}
      {inactiveDrivers.length > 0 && (
        <DashboardRow>
          <DashboardRowHeader
            title={t("Inactive")}
            count={inactiveDrivers.length}
          />
          {inactiveDrivers.map((driver, index) => (
            <DashboardDriverChipComponent
              key={index}
              driver={driver}
              type="inactive"
            />
          ))}
        </DashboardRow>
      )}
    </SectionWrapper>
  )
}

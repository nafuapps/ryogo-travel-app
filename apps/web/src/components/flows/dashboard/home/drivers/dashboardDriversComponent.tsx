import {
  driverServices,
  FindDashboardDriversType,
} from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import { RyogoCaption } from "@/components/typography"
import {
  DashboardItemWrapper,
  DashboardLabelImageChip,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { Route } from "next"

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
      <DashboardSectionHeader title={t("Title")} />

      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Available")}</RyogoCaption>
        <RyogoCaption color="light">{availableDrivers.length}</RyogoCaption>
      </SectionRowWrapper>
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
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("OnTrip")}</RyogoCaption>
        <RyogoCaption color="light">{onTripDrivers.length}</RyogoCaption>
      </SectionRowWrapper>
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
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Leave")}</RyogoCaption>
        <RyogoCaption color="light">{leaveDrivers.length}</RyogoCaption>
      </SectionRowWrapper>
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
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Inactive")}</RyogoCaption>
        <RyogoCaption color="light">{inactiveDrivers.length}</RyogoCaption>
      </SectionRowWrapper>
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

function DashboardDriverChipComponent({
  driver,
  type,
}: {
  driver: FindDashboardDriversType[number]
  type: "available" | "onTrip" | "leave" | "inactive"
}) {
  const driverImageUrl = driver.user.photoUrl

  return (
    <DashboardItemWrapper href={`/dashboard/drivers/${driver.id}` as Route}>
      <DashboardLabelImageChip label={driver.name}>
        {driverImageUrl ? (
          <RyogoImage
            src={getFileUrl(driverImageUrl)}
            alt={driver.name}
            imageSize="xs"
          />
        ) : (
          <RyogoEnclosedIcon icon={IdCard} size="sm" />
        )}
      </DashboardLabelImageChip>
      <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
    </DashboardItemWrapper>
  )
}

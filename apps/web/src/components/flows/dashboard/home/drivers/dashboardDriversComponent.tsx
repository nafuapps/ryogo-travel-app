import {
  driverServices,
  FindDashboardDriversType,
} from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { DashboardLabelImageChip } from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"

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
    <SectionWrapper id="DashboardTrips">
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Available")}</RyogoCaption>
        <RyogoCaption color="light">{availableDrivers.length}</RyogoCaption>
      </SectionRowWrapper>
      {availableDrivers.map((driver, index) => (
        <DashboardDriverChipComponent
          key={index}
          driver={driver}
          type="available"
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("OnTrip")}</RyogoCaption>
        <RyogoCaption color="light">{onTripDrivers.length}</RyogoCaption>
      </SectionRowWrapper>
      {onTripDrivers.map((driver, index) => (
        <DashboardDriverChipComponent
          key={index}
          driver={driver}
          type="onTrip"
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Leave")}</RyogoCaption>
        <RyogoCaption color="light">{leaveDrivers.length}</RyogoCaption>
      </SectionRowWrapper>
      {leaveDrivers.map((driver, index) => (
        <DashboardDriverChipComponent
          key={index}
          driver={driver}
          type="leave"
        />
      ))}
      <Separator />
      <SectionRowWrapper>
        <RyogoCaption color="light">{t("Inactive")}</RyogoCaption>
        <RyogoCaption color="light">{inactiveDrivers.length}</RyogoCaption>
      </SectionRowWrapper>
      {inactiveDrivers.map((driver, index) => (
        <DashboardDriverChipComponent
          key={index}
          driver={driver}
          type="inactive"
        />
      ))}
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
    <Link href={`/dashboard/drivers/${driver.id}`} className="flex">
      <div
        className={`flex flex-row justify-between gap-1 lg:gap-1.5 w-full border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 lg:p-2`}
      >
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
      </div>
    </Link>
  )
}

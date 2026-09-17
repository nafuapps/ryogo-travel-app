import { RyogoSmall, RyogoCaption, RyogoP } from "@/components/typography"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { Rows3, User, Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { DriverStatusPill } from "@/components/pills/ryogoPills"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  GridItemWrapper,
  HoverGridWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default async function AllDriversListComponent({
  allDrivers,
}: {
  allDrivers: FindDriversByAgencyType
}) {
  const t = await getTranslations("Dashboard.Drivers.All")

  return (
    <SectionWrapper id="AllDriversSection">
      <SectionRowWrapper className="items-center">
        <RyogoIcon icon={Rows3} size="sm" color="light" />
        <RyogoSmall color="light">{t("Title")}</RyogoSmall>
        <RyogoSmall color="light" weight="font-bold">
          {allDrivers.length}
        </RyogoSmall>
        <Link href={`/dashboard/drivers/new`} className="ml-auto">
          <RyogoOutlineButton label={t("AddDriver")} className="w-full">
            <RyogoIcon icon={Plus} size="sm" color="slate" />
          </RyogoOutlineButton>
        </Link>
      </SectionRowWrapper>
      {allDrivers.map((driver) => (
        <AllDriversItemComponent key={driver.id} driver={driver} />
      ))}
    </SectionWrapper>
  )
}

async function AllDriversItemComponent({
  driver,
}: {
  driver: FindDriversByAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Drivers.All")

  return (
    <Link href={`/dashboard/drivers/${driver.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          {driver.user.photoUrl ? (
            <RyogoImage
              src={getFileUrl(driver.user.photoUrl)}
              alt={t("Photo") + " " + driver.id}
              imageSize="sm"
            />
          ) : (
            <RyogoEnclosedIcon icon={User} size="md" />
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{driver.phone}</RyogoCaption>
          <RyogoP weight="font-bold"> {driver.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
          <RyogoP weight="font-bold">
            {t("AllowancePerDay", { allowance: driver.defaultAllowancePerDay })}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <DriverStatusPill status={driver.status} />
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}

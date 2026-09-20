import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { Rows3, User, Plus, ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { DriverStatusPill } from "@/components/pills/ryogoPills"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  AddInfoWrapper,
  SectionColWrapper,
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { BASIC_PLAN_DRIVER_LIMIT } from "@/lib/uiConfig"

export default async function AllDriversListComponent({
  allDrivers,
  isPremium,
}: {
  allDrivers: FindDriversByAgencyType
  isPremium: boolean
}) {
  const t = await getTranslations("Dashboard.Drivers.All")

  return (
    <SectionWrapper id="AllDriversSection">
      <SectionHeaderWrapper
        icon={Rows3}
        label={t("Title")}
        count={allDrivers.length}
      />
      <TileGridWrapper>
        {allDrivers.map((driver) => (
          <DriverItemComponent key={driver.id} driver={driver} />
        ))}
      </TileGridWrapper>
      {(isPremium || allDrivers.length < BASIC_PLAN_DRIVER_LIMIT) && (
        <Link href={`/dashboard/drivers/new`} className="w-full">
          <AddInfoWrapper icon={Plus} label={t("AddDriver")} />
        </Link>
      )}
    </SectionWrapper>
  )
}

async function DriverItemComponent({
  driver,
}: {
  driver: FindDriversByAgencyType[number]
}) {
  const t = await getTranslations("Dashboard.Drivers.All")

  return (
    <Link href={`/dashboard/drivers/${driver.id}`}>
      <SectionRowWrapper className="items-center h-full p-4 lg:p-5 border transition hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
        {driver.user.photoUrl ? (
          <RyogoImage
            src={getFileUrl(driver.user.photoUrl)}
            alt={driver.name}
            imageSize="md"
          />
        ) : (
          <RyogoEnclosedIcon icon={User} size="lg" />
        )}
        <SectionColWrapper className="w-full">
          <RyogoP weight="font-bold"> {driver.name}</RyogoP>
          <RyogoCaption color="light" weight="font-bold">
            {driver.phone}
          </RyogoCaption>
          <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
        </SectionColWrapper>
        <SectionColWrapper className="items-end">
          <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
          <RyogoCaption color="light">
            {t("AllowancePerDay", { allowance: driver.defaultAllowancePerDay })}
          </RyogoCaption>
          <DriverStatusPill status={driver.status} />
        </SectionColWrapper>
      </SectionRowWrapper>
    </Link>
  )
}

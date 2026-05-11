import { RyogoSmall, RyogoCaption, RyogoP } from "@/components/typography"
import {
  FindDriversByAgencyType,
  driverServices,
} from "@ryogo-travel-app/api/services/driver.services"
import { Rows3, User, Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Button } from "@/components/ui/button"
import { DriverStatusPill } from "@/components/statusPills/statusPills"
import { getCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { IconsList } from "@/components/tags/IconsList"

export default async function AllDriversListComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Drivers.All")
  const allDrivers = await driverServices.findDriversByAgency(agencyId)

  return (
    <SectionWrapper id="AllDriversSection">
      <SectionHeaderWrapper>
        <RyogoIcon icon={Rows3} size="sm" />
        <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        <RyogoP color="slate"> {allDrivers.length}</RyogoP>
        <Link href={`/dashboard/drivers/new`} className="ml-auto">
          <Button variant={"outline"}>
            <RyogoIcon icon={Plus} size="sm" />
            {t("AddDriver")}
          </Button>
        </Link>
      </SectionHeaderWrapper>
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
      <GridWrapper>
        <GridItemWrapper>
          {driver.user.photoUrl ? (
            <RyogoImage
              src={getFileUrl(driver.user.photoUrl)}
              alt={t("Photo") + " " + driver.id}
              imageSize="sm"
            />
          ) : (
            <RyogoIcon icon={User} size="md" />
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{driver.phone}</RyogoCaption>
          <RyogoP weight="font-bold"> {driver.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <IconsList icons={getCanDriveIcons(driver.canDriveVehicleTypes)} />
          <RyogoP weight="font-bold">
            {t("AllowancePerDay", { allowance: driver.defaultAllowancePerDay })}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <DriverStatusPill status={driver.status} />
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

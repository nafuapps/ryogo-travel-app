import { SmallGrey, H5Grey, Caption, PBold } from "@/components/typography"
import {
  FindDriversByAgencyType,
  driverServices,
} from "@ryogo-travel-app/api/services/driver.services"
import { LucideRows3, LucideUser } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  gridClassName,
  gridItemClassName,
  iconClassName,
  sectionClassName,
  sectionHeaderClassName,
} from "@/components/page/pageCommons"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getVehicleIcon } from "../../components/vehicles/vehicleCommon"
import { DriverStatusPill } from "@/components/statusPills/statusPills"

export default async function AllDriversListComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Drivers.All")
  const allDrivers = await driverServices.findDriversByAgency(agencyId)

  return (
    <div id="AllDriversSection" className={sectionClassName}>
      <div id="AllDriversHeader" className={sectionHeaderClassName}>
        <LucideRows3 className={iconClassName} />
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{allDrivers.length}</H5Grey>
      </div>
      {allDrivers.map((driver) => (
        <AllDriversItemComponent key={driver.id} driver={driver} />
      ))}
      <Link
        href={`/dashboard/drivers/new`}
        className="w-full md:w-1/2 self-center"
      >
        <Button variant={"default"} className="w-full">
          {t("AddDriver")}
        </Button>
      </Link>
    </div>
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
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          {driver.user.photoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                loading="eager"
                src={getFileUrl(driver.user.photoUrl)}
                alt={t("Photo") + " " + driver.id}
                fill
                sizes="(max-width: 1024px) 40px,48px"
              />
            </div>
          ) : (
            <LucideUser className="size-8 lg:size-10 text-slate-400" />
          )}
        </div>
        <div className={gridItemClassName}>
          <Caption>{driver.phone}</Caption>
          <PBold>{driver.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <div className="flex flex-row gap-1 lg:gap-1.5">
            {driver.canDriveVehicleTypes.map((v) => {
              const IconComponent = getVehicleIcon(v)
              return (
                <IconComponent
                  key={v}
                  className="text-slate-400 size-5 lg:size-6"
                />
              )
            })}
          </div>
          <PBold>
            {t("AllowancePerDay", { allowance: driver.defaultAllowancePerDay })}
          </PBold>
        </div>
        <div className={gridItemClassName}>
          <DriverStatusPill status={driver.status} />
        </div>
      </div>
    </Link>
  )
}

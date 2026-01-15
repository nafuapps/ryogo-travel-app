import {
  PGrey,
  H5Grey,
  Caption,
  PBold,
  CaptionBold,
} from "@/components/typography"
import {
  FindDriversByAgencyType,
  driverServices,
} from "@ryogo-travel-app/api/services/driver.services"
import {
  LucideBus,
  LucideCar,
  LucideMotorbike,
  LucideRows3,
  LucideTractor,
  LucideTruck,
  LucideUser,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  gridClassName,
  gridItemClassName,
  iconClassName,
  sectionClassName,
  sectionHeaderClassName,
} from "../../bookings/(all)/bookingCommons"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import Image from "next/image"
import { DriverStatusEnum, VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { Button } from "@/components/ui/button"
import {
  getDriverStatusColor,
  GetVehicleIcon,
} from "../../components/drivers/driverCommon"

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
        <PGrey>{t("Title")}</PGrey>
        <H5Grey>{allDrivers.length}</H5Grey>
      </div>
      {allDrivers.map((driver) => (
        <AllDriversItemComponent key={driver.id} driver={driver} />
      ))}
      <Link href={`/dashboard/drivers/new`} className="min-w-1/2 self-center">
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

  const bgColor = getDriverStatusColor(driver.status)

  return (
    <Link href={`/dashboard/drivers/${driver.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          {driver.user.photoUrl ? (
            <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
              <Image
                src={getFileUrl(driver.user.photoUrl)}
                alt={t("Photo") + " " + driver.id}
                fill
                sizes="(max-width: 768px) 40px,48px"
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
              const IconComponent = GetVehicleIcon({ vehicleType: v })
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
          <div
            className={`flex justify-center items-center rounded-full ${bgColor} px-2 py-1.5 lg:px-3 lg:py-2`}
          >
            <CaptionBold>{driver.status.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}

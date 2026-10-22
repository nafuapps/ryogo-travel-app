import SubscriptionWarningCard from "@/components/flows/susbcription/subscriptionWarningCard"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { DriverStatusPill } from "@/components/pills/ryogoPills"
import { RyogoTagWithoutBG } from "@/components/tags/ryogoTag"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { getAverageRating } from "@/lib/utils"
import { BASIC_PLAN_DRIVER_LIMIT } from "@ryogo-travel-app/api/apiConfig"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { BadgeIndianRupee, Rows3, Star, User } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function AllDriversListComponent({
  allDrivers,
  isSubscribed,
  hasTriedSubscription,
}: {
  allDrivers: FindDriversByAgencyType
  isSubscribed: boolean
  hasTriedSubscription: boolean
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
        {!isSubscribed && allDrivers.length >= BASIC_PLAN_DRIVER_LIMIT && (
          <SubscriptionWarningCard
            warningText={t("Warning")}
            ctaText={hasTriedSubscription ? t("BuyCTA") : t("TryCTA")}
          />
        )}
      </TileGridWrapper>
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
      <SectionColWrapper className="h-full p-4 lg:p-5 border transition hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
        <SectionRowWrapper className="items-center justify-between">
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
            <RyogoCaption color="light" weight="font-medium">
              {driver.phone}
            </RyogoCaption>
            <DriverStatusPill status={driver.status} className="self-start" />
          </SectionColWrapper>
        </SectionRowWrapper>
        <SectionRowWrapper className="p-2 lg:p-3 border rounded-md items-center justify-between">
          <RyogoTagWithoutBG
            label={t("AllowancePerDay", {
              allowance: driver.defaultAllowancePerDay,
            })}
            icon={BadgeIndianRupee}
          />
          {driver.customerRatings && driver.customerRatings.length > 0 && (
            <RyogoTagWithoutBG
              label={getAverageRating(driver.customerRatings)}
              icon={Star}
            />
          )}
          <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
        </SectionRowWrapper>
      </SectionColWrapper>
    </Link>
  )
}

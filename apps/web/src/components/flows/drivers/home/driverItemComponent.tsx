"use client"

import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { DriverStatusPill } from "@/components/pills/ryogoPills"
import { RyogoTagWithoutBG } from "@/components/tags/ryogoTag"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { getAverageRating } from "@/lib/utils"
import { FindAgencySearchDataType } from "@ryogo-travel-app/api/services/agency.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { BadgeIndianRupee, Star, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function DriverItemComponent({
  driver,
}: {
  driver:
    | FindDriversByAgencyType[number]
    | FindAgencySearchDataType["drivers"][number]
}) {
  const t = useTranslations("Dashboard.Drivers.All")

  return (
    <Link href={`/dashboard/drivers/${driver.id}`} prefetch={false}>
      <SectionWrapper id={driver.id} className="transition hover:opacity-70">
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
        <SectionRowWrapper className="items-center justify-between">
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
      </SectionWrapper>
    </Link>
  )
}

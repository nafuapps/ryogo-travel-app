import { pageClassName } from "@/components/page/pageCommons"
import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "./driverDetailHeaderTabs"
import {
  Caption,
  CaptionGrey,
  H3,
  PBold,
  Small,
  SmallBold,
} from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { LucideStar, LucideUser } from "lucide-react"
import moment from "moment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getDriverStatusColor } from "../../components/drivers/driverCommon"

/**
 * Actions:
 * 1. If inactive, activate
 * 2. Change profile picture
 * 3. Edit details
 * 4. Inactivate driver
 * 5. License expiry -> Send reminder to driver for renewing license
 * 6.
 */

export default async function DriverDetailsPageComponent({
  driver,
}: {
  driver: FindDriverDetailsByIdType
}) {
  const t = await getTranslations("Dashboard.DriverDetails")

  const bgColor = getDriverStatusColor(driver.status)

  return (
    <div id="DriverDetailsPage" className={pageClassName}>
      <DriverDetailHeaderTabs selectedTab={"Details"} id={driver.id} />
      <div
        id="DriverDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <DriverSection sectionTitle={t("BasicInfo")}>
          <div className="flex flex-col gap-2 lg:gap-3">
            {driver.user.photoUrl ? (
              <div className="relative size-24 lg:size-28 rounded-lg overflow-hidden">
                <Image
                  src={getFileUrl(driver.user.photoUrl)}
                  alt={t("Photo")}
                  fill
                  sizes="(max-width: 768px) 96px,112px"
                />
              </div>
            ) : (
              <LucideUser className="size-20 lg:size-24 text-slate-400" />
            )}
            <H3>{driver.name}</H3>
          </div>
          <div className="flex flex-col gap-2 lg:gap-3">
            <div
              className={`flex items-center justify-center ${bgColor} rounded-full gap-1 lg:gap-1.5 p-1.5 lg:p-2`}
            >
              <Small>{driver.status.toUpperCase()}</Small>
            </div>
            <Caption>{driver.phone}</Caption>
            <Caption>{driver.user.email}</Caption>
            <Caption>{moment(driver.createdAt).format("DD MMM YYYY")}</Caption>
          </div>
          {driver.customerRatings && driver.customerRatings.length > 1 && (
            <div className="flex col-span-2 flex-col items-center justify-center bg-slate-100 rounded-lg gap-2 lg:gap-3 p-2 lg:p-3">
              <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center">
                <LucideStar className="text-slate-900 size-5 lg:size-6" />
                <PBold>
                  {(
                    driver.customerRatings.reduce((a, c) => a + c, 0) /
                    driver.customerRatings.length
                  ).toFixed(1)}
                </PBold>
              </div>
              <CaptionGrey>
                {t("NumberRatings", {
                  number: driver.customerRatings.length,
                })}
              </CaptionGrey>
            </div>
          )}
        </DriverSection>
        <Separator />
        <DriverSection sectionTitle={t("LicenseInfo")}>
          <div className="flex flex-col gap-1 lg:gap-1.5">
            <Caption>{driver.licenseNumber}</Caption>
            <Caption>
              {moment(driver.licenseExpiresOn).format("DD MMM YYYY")}
            </Caption>
          </div>
          {driver.licensePhotoUrl && (
            <div className="relative flex justify-center items-center size-10 lg:size-12 rounded-lg overflow-hidden">
              <Dialog>
                <DialogTrigger className="w-full hover:underline hover:cursor-pointer">
                  <Image
                    src={getFileUrl(driver.licensePhotoUrl)}
                    alt={t("LicensePhoto")}
                    fill
                    className="object-contain"
                  />
                </DialogTrigger>
                <DialogContent className="size-10/12">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <Image
                    src={getFileUrl(driver.licensePhotoUrl)}
                    alt={t("LicensePhoto")}
                    fill
                    className="object-contain"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </DriverSection>
        <Separator />
        <DriverSection sectionTitle={t("AgencyInfo")}>
          <div></div>
        </DriverSection>
        <Separator />
        <div id="DriverActions"></div>
      </div>
    </div>
  )
}

type DriverSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
function DriverSection(props: DriverSectionType) {
  return (
    <div id={props.sectionTitle} className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{props.sectionTitle}</SmallBold>
      <div className="grid grid-cols-2 gap-3 lg:gap-4 items-start">
        {props.children}
      </div>
    </div>
  )
}

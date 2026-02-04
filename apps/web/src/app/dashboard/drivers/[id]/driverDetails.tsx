import { pageClassName } from "@/components/page/pageCommons"
import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "./driverDetailHeaderTabs"
import {
  Caption,
  CaptionRed,
  H4,
  PBold,
  SmallBold,
  SmallGrey,
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
import { Button } from "@/components/ui/button"
import Link from "next/link"
import InactivateDriverAlertButton from "../../components/buttons/inactivateDriverAlertButton"
import ActivateDriverAlertButton from "../../components/buttons/activateDriverAlertButton"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import ChangeDriverPhotoSheet from "./changeDriverPhotoSheet"
import { getVehicleIcon } from "../../components/vehicles/vehicleCommon"

//TODO: Add driver schedule chart

export default async function DriverDetailsPageComponent({
  driver,
}: {
  driver: NonNullable<FindDriverDetailsByIdType>
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
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-2 lg:gap-3 items-start">
              {driver.user.photoUrl ? (
                <div className="relative size-28 lg:size-32 rounded-lg overflow-hidden">
                  <Image
                    src={getFileUrl(driver.user.photoUrl)}
                    alt={t("Photo")}
                    fill
                    sizes="(max-width: 768px) 112px,128px"
                  />
                </div>
              ) : (
                <LucideUser className="size-20 lg:size-24 text-slate-400" />
              )}
              <ChangeDriverPhotoSheet userId={driver.userId} />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <H4>{driver.name}</H4>
              <Caption>{driver.phone}</Caption>
              <Caption>{driver.user.email}</Caption>
              <Caption>
                {moment(driver.createdAt).format("DD MMM YYYY")}
              </Caption>
              {driver.customerRatings && driver.customerRatings.length > 1 && (
                <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center">
                  <LucideStar className="text-slate-900 size-5 lg:size-6" />
                  <PBold>
                    {(
                      driver.customerRatings.reduce((a, c) => a + c, 0) /
                      driver.customerRatings.length
                    ).toFixed(1)}
                  </PBold>
                  <SmallGrey>
                    {t("NumberRatings", {
                      number: driver.customerRatings.length,
                    })}
                  </SmallGrey>
                </div>
              )}
              <div
                className={`flex items-center justify-center ${bgColor} rounded-full gap-1 lg:gap-1.5 px-3 py-1.5 lg:px-6 lg:py-2`}
              >
                <Caption>{driver.status.toUpperCase()}</Caption>
              </div>
            </div>
          </div>
        </DriverSection>
        <Separator />
        <DriverSection sectionTitle={t("LicenseInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <SmallGrey>{driver.licenseNumber}</SmallGrey>
              {driver.licenseExpiresOn &&
              driver.licenseExpiresOn < new Date() ? (
                <CaptionRed>
                  {t("ValidTill") +
                    moment(driver.licenseExpiresOn).format("DD MMM YYYY")}
                </CaptionRed>
              ) : (
                <Caption>
                  {t("ValidTill") +
                    moment(driver.licenseExpiresOn).format("DD MMM YYYY")}
                </Caption>
              )}
            </div>
            {driver.licensePhotoUrl && (
              <Dialog>
                <DialogTrigger className="relative flex justify-center items-center size-10 lg:size-12 rounded-lg overflow-hidden border border-slate-200 hover:border-slate-500">
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
            )}
          </div>
        </DriverSection>
        <Separator />
        <DriverSection sectionTitle={t("AgencyInfo")}>
          <div className="flex flex-col gap-1 lg:gap-1.5">
            <Caption>{driver.address}</Caption>
            <PBold>
              {t("PerDay", { allowance: driver.defaultAllowancePerDay })}
            </PBold>
            <div className="flex flex-row gap-1 lg:gap-1.5">
              {driver.canDriveVehicleTypes.map((v) => {
                const IconComponent = getVehicleIcon({ vehicleType: v })
                return (
                  <IconComponent
                    key={v}
                    className="text-slate-400 size-5 lg:size-6"
                  />
                )
              })}
            </div>
          </div>
        </DriverSection>
        <Separator />
        <div id="DriverActions" className="flex flex-col gap-2 lg:gap-3">
          <Link href={`/dashboard/drivers/${driver.id}/modify`}>
            <Button variant={"outline"} className="w-full">
              {t("EditDetails")}
            </Button>
          </Link>
          {driver.status !== DriverStatusEnum.INACTIVE &&
            driver.status !== DriverStatusEnum.ON_TRIP && (
              <InactivateDriverAlertButton driverId={driver.id} />
            )}
          {driver.status === DriverStatusEnum.INACTIVE && (
            <ActivateDriverAlertButton
              driverId={driver.id}
              userId={driver.userId}
            />
          )}
        </div>
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
      {props.children}
    </div>
  )
}

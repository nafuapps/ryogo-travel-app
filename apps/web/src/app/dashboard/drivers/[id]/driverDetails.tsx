import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/driverDetailHeaderTabs"
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
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Star, User } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import InactivateDriverAlertButton from "@/components/buttons/inactivateDriverAlertButton"
import ActivateDriverAlertButton from "@/components/buttons/activateDriverAlertButton"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import ChangeDriverPhotoSheet from "@/components/sheets/changeDriverPhotoSheet"
import { DriverStatusPill } from "@/components/statusPills/statusPills"
import getVehicleIcon from "@/components/icons/vehicleIcon"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

//TODO: Add driver schedule chart

export default async function DriverDetailsPageComponent({
  driver,
}: {
  driver: NonNullable<FindDriverDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.DriverDetails")

  return (
    <PageWrapper id="DriverDetailsPage">
      <DriverDetailHeaderTabs selectedTab={"Details"} id={driver.id} />
      <ContentWrapper id="DriverDetailsInfo">
        <DriverSection sectionTitle={t("BasicInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-2 lg:gap-3">
              {driver.user.photoUrl ? (
                <RyogoImage
                  src={getFileUrl(driver.user.photoUrl)}
                  alt={t("Photo")}
                  imageSize="lg"
                />
              ) : (
                <RyogoIcon icon={User} size="xl" />
              )}
              <ChangeDriverPhotoSheet
                userId={driver.userId}
                agencyId={driver.agencyId}
              />
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
                  <RyogoIcon icon={Star} size="sm" />
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
              <DriverStatusPill status={driver.status} />
            </div>
          </div>
        </DriverSection>
        <Separator />
        <DriverSection sectionTitle={t("LicenseInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
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
              <RyogoDialogImage
                src={getFileUrl(driver.licensePhotoUrl)}
                alt={t("LicensePhoto")}
              />
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
                return getVehicleIcon(v)
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
              <InactivateDriverAlertButton
                driverId={driver.id}
                agencyId={driver.agencyId}
              />
            )}
          {driver.status === DriverStatusEnum.INACTIVE && (
            <ActivateDriverAlertButton
              driverId={driver.id}
              userId={driver.userId}
              agencyId={driver.agencyId}
            />
          )}
        </div>
      </ContentWrapper>
    </PageWrapper>
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

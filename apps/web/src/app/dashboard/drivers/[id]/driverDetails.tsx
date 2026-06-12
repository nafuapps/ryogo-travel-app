import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import {
  RyogoCaption,
  RyogoH3,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import InactivateDriverAlertButton from "@/components/buttons/alert/inactivateDriverAlertButton"
import ActivateDriverAlertButton from "@/components/buttons/alert/activateDriverAlertButton"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { DriverStatusPill } from "@/components/statusPills/statusPills"
import { getCanDriveIcons } from "@/components/icons/vehicleIcon"
import {
  SectionWrapper,
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import RyogoRatingDisplay from "@/components/ratings/ryogoRatingDisplay"
import { IconsList } from "@/components/tags/IconsList"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"

export default async function DriverDetailsPageComponent({
  driver,
}: {
  driver: NonNullable<FindDriverDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.DriverDetails")

  return (
    <PageWrapper id="DriverDetailsPage">
      <DriverDetailHeaderTabs selectedTab={"Driver"} id={driver.id} />
      <SectionWrapper id="BasicInfo">
        <RyogoSmall weight="font-bold">{t("BasicInfo")}</RyogoSmall>
        <SectionRowWrapper>
          <SectionColWrapper>
            {driver.user.photoUrl ? (
              <RyogoImage
                src={getFileUrl(driver.user.photoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="xl" />
            )}
            <ChangeUserPhotoSheet
              userId={driver.userId}
              agencyId={driver.agencyId}
            />
          </SectionColWrapper>
          <SectionColWrapper end>
            <RyogoH3>{driver.name}</RyogoH3>
            <RyogoCaption color="slate">{driver.phone}</RyogoCaption>
            <RyogoCaption color="slate">{driver.user.email}</RyogoCaption>
            <RyogoCaption color="slate">
              {moment(driver.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            {driver.customerRatings && driver.customerRatings.length > 1 && (
              <RyogoRatingDisplay
                label={t("NumberRatings", {
                  number: driver.customerRatings.length,
                })}
                ratings={driver.customerRatings}
              />
            )}
            <DriverStatusPill status={driver.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id="LicenseInfo">
        <RyogoSmall weight="font-bold">{t("LicenseInfo")}</RyogoSmall>
        <SectionRowWrapper>
          <SectionColWrapper small>
            <RyogoSmall color="slate">{driver.licenseNumber}</RyogoSmall>
            {driver.licenseExpiresOn && driver.licenseExpiresOn < new Date() ? (
              <RyogoCaption color="red">
                {t("ValidTill") +
                  moment(driver.licenseExpiresOn).format("DD MMM YYYY")}
              </RyogoCaption>
            ) : (
              <RyogoCaption color="slate">
                {t("ValidTill") +
                  moment(driver.licenseExpiresOn).format("DD MMM YYYY")}
              </RyogoCaption>
            )}
          </SectionColWrapper>
          {driver.licensePhotoUrl && (
            <RyogoDialogImage
              src={getFileUrl(driver.licensePhotoUrl)}
              alt={t("LicensePhoto")}
            />
          )}
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id="AgencyInfo">
        <RyogoSmall weight="font-bold">{t("AgencyInfo")}</RyogoSmall>
        <SectionColWrapper>
          <RyogoCaption color="slate">{driver.address}</RyogoCaption>
          <RyogoP weight="font-bold">
            {t("PerDay", { allowance: driver.defaultAllowancePerDay })}
          </RyogoP>
          <IconsList icons={getCanDriveIcons(driver.canDriveVehicleTypes)} />
        </SectionColWrapper>
      </SectionWrapper>
      <SectionWrapper id="DriverActions">
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
      </SectionWrapper>
    </PageWrapper>
  )
}

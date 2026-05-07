import { FindVehicleDetailsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  RyogoCaption,
  RyogoH3,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import moment from "moment"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import { Separator } from "@/components/ui/separator"
import ActivateVehicleAlertButton from "@/components/buttons/activateVehicleAlertButton"
import InactivateVehicleAlertButton from "@/components/buttons/inactivateVehicleAlertButton"
import Link from "next/link"
import ChangeVehiclePhotoSheet from "@/components/sheets/changeVehiclePhotoSheet"
import { VehicleStatusPill } from "@/components/statusPills/statusPills"
import getVehicleIcon from "@/components/icons/vehicleIcon"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

//TODO: Add vehicle schedule chart

export default async function VehicleDetailsPageComponent({
  vehicle,
}: {
  vehicle: NonNullable<FindVehicleDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.VehicleDetails")
  return (
    <PageWrapper id="VehicleDetailsPage">
      <VehicleDetailHeaderTabs selectedTab={"Details"} id={vehicle.id} />
      <ContentWrapper id="VehicleDetailsInfo">
        <VehicleSection sectionTitle={t("BasicInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-2 lg:gap-3">
              {vehicle.vehiclePhotoUrl ? (
                <RyogoImage
                  src={getFileUrl(vehicle.vehiclePhotoUrl)}
                  alt={t("Photo")}
                  imageSize="lg"
                />
              ) : (
                getVehicleIcon(vehicle.type, "2xl")
              )}
              <ChangeVehiclePhotoSheet
                vehicleId={vehicle.id}
                agencyId={vehicle.agencyId}
              />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <RyogoH3>{vehicle.vehicleNumber}</RyogoH3>
              <RyogoCaption color="slate">
                {vehicle.brand + " " + vehicle.model}
              </RyogoCaption>
              <RyogoCaption color="slate">{vehicle.color}</RyogoCaption>
              <RyogoCaption color="slate">
                {vehicle.hasAC ? t("AC") : t("NonAC")}
              </RyogoCaption>
              <RyogoCaption color="slate">
                {t("Capacity", { capacity: vehicle.capacity })}
              </RyogoCaption>
              <RyogoCaption color="slate">
                {t("Odometer", { odometer: vehicle.odometerReading })}
              </RyogoCaption>
              <RyogoCaption color="slate">
                {moment(vehicle.createdAt).format("DD MMM YYYY")}
              </RyogoCaption>
              {vehicle.customerRatings &&
                vehicle.customerRatings.length > 1 && (
                  <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center">
                    <RyogoIcon icon={Star} size="sm" />
                    <RyogoP weight="font-bold">
                      {(
                        vehicle.customerRatings.reduce((a, c) => a + c, 0) /
                        vehicle.customerRatings.length
                      ).toFixed(1)}
                    </RyogoP>
                    <RyogoSmall color="slate">
                      {t("NumberRatings", {
                        number: vehicle.customerRatings.length,
                      })}
                    </RyogoSmall>
                  </div>
                )}
              <VehicleStatusPill status={vehicle.status} />
            </div>
          </div>
        </VehicleSection>
        <Separator />
        <VehicleSection sectionTitle={t("PolicyInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <RyogoSmall color="slate">{t("Insurance")}</RyogoSmall>
              {vehicle.insuranceExpiresOn &&
              vehicle.insuranceExpiresOn < new Date() ? (
                <RyogoCaption color="red">
                  {t("ValidTill") +
                    moment(vehicle.insuranceExpiresOn).format("DD MMM YYYY")}
                </RyogoCaption>
              ) : (
                <RyogoCaption color="slate">
                  {t("ValidTill") +
                    moment(vehicle.insuranceExpiresOn).format("DD MMM YYYY")}
                </RyogoCaption>
              )}
            </div>
            {vehicle.insurancePhotoUrl && (
              <RyogoDialogImage
                src={getFileUrl(vehicle.insurancePhotoUrl)}
                alt={t("InsurancePhoto")}
              />
            )}
          </div>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <RyogoSmall color="slate">{t("PUC")}</RyogoSmall>
              {vehicle.pucExpiresOn && vehicle.pucExpiresOn < new Date() ? (
                <RyogoCaption color="red">
                  {t("ValidTill") +
                    moment(vehicle.pucExpiresOn).format("DD MMM YYYY")}
                </RyogoCaption>
              ) : (
                <RyogoCaption color="slate">
                  {t("ValidTill") +
                    moment(vehicle.pucExpiresOn).format("DD MMM YYYY")}
                </RyogoCaption>
              )}
            </div>
            {vehicle.pucPhotoUrl && (
              <RyogoDialogImage
                src={getFileUrl(vehicle.pucPhotoUrl)}
                alt={t("PUCPhoto")}
              />
            )}
          </div>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <RyogoSmall color="slate">{t("RC")}</RyogoSmall>
              {vehicle.rcExpiresOn && vehicle.rcExpiresOn < new Date() ? (
                <RyogoCaption color="red">
                  {t("ValidTill") +
                    moment(vehicle.rcExpiresOn).format("DD MMM YYYY")}
                </RyogoCaption>
              ) : (
                <RyogoCaption color="slate">
                  {t("ValidTill") +
                    moment(vehicle.rcExpiresOn).format("DD MMM YYYY")}
                </RyogoCaption>
              )}
            </div>
            {vehicle.rcPhotoUrl && (
              <RyogoDialogImage
                src={getFileUrl(vehicle.rcPhotoUrl)}
                alt={t("RCPhoto")}
              />
            )}
          </div>
        </VehicleSection>
        <Separator />
        <VehicleSection sectionTitle={t("AgencyInfo")}>
          <div className="flex flex-col gap-1 lg:gap-1.5">
            {vehicle.hasAC && (
              <RyogoCaption color="slate">
                {t("ACCharge", { ac: vehicle.defaultAcChargePerDay })}
              </RyogoCaption>
            )}
            <RyogoP weight="font-bold">
              {" "}
              {t("RatePerKm", { rate: vehicle.defaultRatePerKm })}
            </RyogoP>
          </div>
        </VehicleSection>
        <Separator />
        <div id="VehicleActions" className="flex flex-col gap-2 lg:gap-3">
          <Link href={`/dashboard/vehicles/${vehicle.id}/modify`}>
            <Button variant={"outline"} className="w-full">
              {t("EditDetails")}
            </Button>
          </Link>
          {vehicle.status !== VehicleStatusEnum.INACTIVE &&
            vehicle.status !== VehicleStatusEnum.ON_TRIP && (
              <InactivateVehicleAlertButton
                vehicleId={vehicle.id}
                agencyId={vehicle.agencyId}
              />
            )}
          {vehicle.status === VehicleStatusEnum.INACTIVE && (
            <ActivateVehicleAlertButton
              vehicleId={vehicle.id}
              agencyId={vehicle.agencyId}
            />
          )}
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

type VehicleSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
function VehicleSection(props: VehicleSectionType) {
  return (
    <div id={props.sectionTitle} className="flex flex-col gap-2 lg:gap-3">
      <RyogoSmall weight="font-bold">{props.sectionTitle}</RyogoSmall>
      {props.children}
    </div>
  )
}

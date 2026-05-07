import { FindVehicleDetailsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { LucideStar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Caption,
  CaptionRed,
  H4,
  PBold,
  SmallBold,
  SmallGrey,
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
                getVehicleIcon(vehicle.type, "xl")
              )}
              <ChangeVehiclePhotoSheet
                vehicleId={vehicle.id}
                agencyId={vehicle.agencyId}
              />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <H4>{vehicle.vehicleNumber}</H4>
              <Caption>{vehicle.brand + " " + vehicle.model}</Caption>
              <Caption>{vehicle.color}</Caption>
              <Caption>{vehicle.hasAC ? t("AC") : t("NonAC")}</Caption>
              <Caption>{t("Capacity", { capacity: vehicle.capacity })}</Caption>
              <Caption>
                {t("Odometer", { odometer: vehicle.odometerReading })}
              </Caption>
              <Caption>
                {moment(vehicle.createdAt).format("DD MMM YYYY")}
              </Caption>
              {vehicle.customerRatings &&
                vehicle.customerRatings.length > 1 && (
                  <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center">
                    <LucideStar className="text-slate-900 size-5 lg:size-6" />
                    <PBold>
                      {(
                        vehicle.customerRatings.reduce((a, c) => a + c, 0) /
                        vehicle.customerRatings.length
                      ).toFixed(1)}
                    </PBold>
                    <SmallGrey>
                      {t("NumberRatings", {
                        number: vehicle.customerRatings.length,
                      })}
                    </SmallGrey>
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
              <SmallGrey>{t("Insurance")}</SmallGrey>
              {vehicle.insuranceExpiresOn &&
              vehicle.insuranceExpiresOn < new Date() ? (
                <CaptionRed>
                  {t("ValidTill") +
                    moment(vehicle.insuranceExpiresOn).format("DD MMM YYYY")}
                </CaptionRed>
              ) : (
                <Caption>
                  {t("ValidTill") +
                    moment(vehicle.insuranceExpiresOn).format("DD MMM YYYY")}
                </Caption>
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
              <SmallGrey>{t("PUC")}</SmallGrey>
              {vehicle.pucExpiresOn && vehicle.pucExpiresOn < new Date() ? (
                <CaptionRed>
                  {t("ValidTill") +
                    moment(vehicle.pucExpiresOn).format("DD MMM YYYY")}
                </CaptionRed>
              ) : (
                <Caption>
                  {t("ValidTill") +
                    moment(vehicle.pucExpiresOn).format("DD MMM YYYY")}
                </Caption>
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
              <SmallGrey>{t("RC")}</SmallGrey>
              {vehicle.rcExpiresOn && vehicle.rcExpiresOn < new Date() ? (
                <CaptionRed>
                  {t("ValidTill") +
                    moment(vehicle.rcExpiresOn).format("DD MMM YYYY")}
                </CaptionRed>
              ) : (
                <Caption>
                  {t("ValidTill") +
                    moment(vehicle.rcExpiresOn).format("DD MMM YYYY")}
                </Caption>
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
              <Caption>
                {t("ACCharge", { ac: vehicle.defaultAcChargePerDay })}
              </Caption>
            )}
            <PBold>{t("RatePerKm", { rate: vehicle.defaultRatePerKm })}</PBold>
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
      <SmallBold>{props.sectionTitle}</SmallBold>
      {props.children}
    </div>
  )
}

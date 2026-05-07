import { RyogoIcon } from "@/components/icons/RyogoIcon"
import getVehicleIcon from "@/components/icons/vehicleIcon"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import {
  H4,
  PBold,
  SmallGrey,
  CaptionRed,
  SmallBold,
  Caption,
} from "@/components/typography"
import { Separator } from "@radix-ui/react-separator"
import { FindAssignedVehicleByDriverIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Star } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"

export default async function RiderMyVehiclePageComponent({
  vehicle,
}: {
  vehicle: FindAssignedVehicleByDriverIdType
}) {
  const t = await getTranslations("Rider.MyVehicle")

  if (!vehicle) {
    return (
      <div id="VehicleDetailsPage">
        <div
          id="VehicleDetailsInfo"
          className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5 items-center"
        >
          <Caption>{t("NoVehicleAssigned")}</Caption>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper id="RiderVehicleDetailsPage">
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
                    <RyogoIcon icon={Star} size="sm" />
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

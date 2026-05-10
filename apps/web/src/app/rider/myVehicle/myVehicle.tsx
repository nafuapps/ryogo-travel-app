import getVehicleIcon from "@/components/icons/vehicleIcon"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import RyogoRatingDisplay from "@/components/ratings/ryogoRatingDisplay"
import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { FindAssignedVehicleByDriverIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
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
      <PageWrapper id="VehicleDetailsPage">
        <SectionWrapper id="VehicleDetailsInfo">
          <RyogoCaption color="slate">{t("NoVehicleAssigned")}</RyogoCaption>
        </SectionWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper id="RiderVehicleDetailsPage">
      <SectionWrapper id="BasicInfo">
        <RyogoSmall weight="font-bold">{t("BasicInfo")}</RyogoSmall>
        <SectionRowWrapper>
          <SectionColWrapper>
            {vehicle.vehiclePhotoUrl ? (
              <RyogoImage
                src={getFileUrl(vehicle.vehiclePhotoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              getVehicleIcon(vehicle.type, "xl")
            )}
          </SectionColWrapper>
          <SectionColWrapper end>
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
            {vehicle.customerRatings && vehicle.customerRatings.length > 1 && (
              <RyogoRatingDisplay
                label={t("NumberRatings", {
                  number: vehicle.customerRatings.length,
                })}
                ratings={vehicle.customerRatings}
              />
            )}
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id="PolicyInfo">
        <RyogoSmall weight="font-bold">{t("PolicyInfo")}</RyogoSmall>
        <SectionRowWrapper>
          <SectionColWrapper>
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
          </SectionColWrapper>
          {vehicle.insurancePhotoUrl && (
            <RyogoDialogImage
              src={getFileUrl(vehicle.insurancePhotoUrl)}
              alt={t("InsurancePhoto")}
            />
          )}
        </SectionRowWrapper>
        <SectionRowWrapper>
          <SectionColWrapper>
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
          </SectionColWrapper>
          {vehicle.pucPhotoUrl && (
            <RyogoDialogImage
              src={getFileUrl(vehicle.pucPhotoUrl)}
              alt={t("PUCPhoto")}
            />
          )}
        </SectionRowWrapper>
        <SectionRowWrapper>
          <SectionColWrapper>
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
          </SectionColWrapper>
          {vehicle.rcPhotoUrl && (
            <RyogoDialogImage
              src={getFileUrl(vehicle.rcPhotoUrl)}
              alt={t("RCPhoto")}
            />
          )}
        </SectionRowWrapper>
      </SectionWrapper>
    </PageWrapper>
  )
}

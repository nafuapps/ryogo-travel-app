import { RyogoIcon } from "@/components/icons/RyogoIcon"
import getVehicleIcon from "@/components/icons/vehicleIcon"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import {
  RyogoH3,
  RyogoP,
  RyogoSmall,
  RyogoCaption,
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
          <RyogoCaption color="slate">{t("NoVehicleAssigned")}</RyogoCaption>
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

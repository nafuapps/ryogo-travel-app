import { FindVehicleDetailsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
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
import ActivateVehicleAlertButton from "@/components/buttons/alert/activateVehicleAlertButton"
import InactivateVehicleAlertButton from "@/components/buttons/alert/inactivateVehicleAlertButton"
import Link from "next/link"
import ChangeVehiclePhotoSheet from "@/components/sheets/changeVehiclePhotoSheet"
import { VehicleStatusPill } from "@/components/statusPills/statusPills"
import getVehicleIcon from "@/components/icons/vehicleIcon"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import RyogoRatingDisplay from "@/components/ratings/ryogoRatingDisplay"

//TODO: Add vehicle schedule chart

export default async function VehicleDetailsPageComponent({
  vehicle,
}: {
  vehicle: NonNullable<FindVehicleDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.VehicleDetails")
  return (
    <PageWrapper id="VehicleDetailsPage">
      <VehicleDetailHeaderTabs selectedTab={"Vehicle"} id={vehicle.id} />
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
            <ChangeVehiclePhotoSheet
              vehicleId={vehicle.id}
              agencyId={vehicle.agencyId}
            />
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
            <VehicleStatusPill status={vehicle.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id="PolicyInfo">
        <RyogoSmall weight="font-bold">{t("PolicyInfo")}</RyogoSmall>
        <SectionRowWrapper>
          <SectionColWrapper small>
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
          <SectionColWrapper small>
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
          <SectionColWrapper small>
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
      <SectionWrapper id="AgencyInfo">
        <RyogoSmall weight="font-bold">{t("AgencyInfo")}</RyogoSmall>
        <SectionColWrapper>
          {vehicle.hasAC && (
            <RyogoCaption color="slate">
              {t("ACCharge", { ac: vehicle.defaultAcChargePerDay })}
            </RyogoCaption>
          )}
          <RyogoSmall>
            {t("RatePerKm", { rate: vehicle.defaultRatePerKm })}
          </RyogoSmall>
        </SectionColWrapper>
      </SectionWrapper>
      <SectionWrapper id="VehiclActions">
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
      </SectionWrapper>
    </PageWrapper>
  )
}

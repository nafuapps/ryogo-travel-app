"use client"

import { RyogoCaption, RyogoP } from "@/components/typography"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
  DetailsLineItem,
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import moment from "moment"
import {
  NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
  NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
} from "@/lib/uiConfig"

export function AddVehicleConfirm({
  onNext,
  onPrev,
  finalData,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: AddVehicleRequestType
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Confirm")
  const router = useRouter()

  const formData = useForm<AddVehicleRequestType>()

  //Submit actions
  const onSubmit = async () => {
    const addedVehicle = await addVehicleAction({
      agencyId: finalData.agencyId,
      addedByUserId: finalData.addedByUserId,
      vehicleNumber: finalData.vehicleNumber,
      type: finalData.type,
      brand: finalData.brand,
      color: finalData.color,
      model: finalData.model,
      capacity: finalData.capacity,
      odometerReading: finalData.odometerReading,
      insuranceExpiresOn: finalData.insuranceExpiresOn,
      pucExpiresOn: finalData.pucExpiresOn,
      rcExpiresOn: finalData.rcExpiresOn,
      hasAC: finalData.hasAC,
      defaultRatePerKm: finalData.defaultRatePerKm,
      defaultAcChargePerDay: finalData.defaultAcChargePerDay,
      rcPhotos: finalData.rcPhotos,
      pucPhotos: finalData.pucPhotos,
      insurancePhotos: finalData.insurancePhotos,
      vehiclePhotos: finalData.vehiclePhotos,
    })
    if (addedVehicle) {
      onNext()
    } else {
      //If failed, Take back to vehicle onboarding page and show error
      toast.error(t("APIError"))
      router.refresh()
    }
  }

  return (
    <FormWrapper
      id="Step5Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoP color="slate">{t("Title")}</RyogoP>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("BasicDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            <DetailsLineItem
              label={t("VehicleNumber")}
              value={finalData.vehicleNumber.toUpperCase()}
            />
            <DetailsLineItem label={t("Type")} value={finalData.type} />
            <DetailsLineItem label={t("Brand")} value={finalData.brand} />
            <DetailsLineItem label={t("Model")} value={finalData.model} />
            <DetailsLineItem label={t("Color")} value={finalData.color} />
            <DetailsLineItem
              label={t("HasAC")}
              value={finalData.hasAC ? "Yes" : "No"}
            />
            {finalData.capacity && (
              <DetailsLineItem
                label={t("Capacity")}
                value={`${finalData.capacity}`}
              />
            )}
            {finalData.odometerReading && (
              <DetailsLineItem
                label={t("OdometerReading")}
                value={`${finalData.odometerReading}`}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("PolicyDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            {finalData.rcExpiresOn && (
              <DetailsLineItem
                label={t("RCExpiresOn")}
                value={moment(finalData.rcExpiresOn).format("DD MMM YYYY")}
              />
            )}
            {finalData.insuranceExpiresOn && (
              <DetailsLineItem
                label={t("InsuranceExpiresOn")}
                value={moment(finalData.insuranceExpiresOn).format(
                  "DD MMM YYYY",
                )}
              />
            )}
            {finalData.pucExpiresOn && (
              <DetailsLineItem
                label={t("PUCExpiresOn")}
                value={moment(finalData.pucExpiresOn).format("DD MMM YYYY")}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("AgencyDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            <DetailsLineItem
              label={t("RatePerKm")}
              value={`${finalData.defaultRatePerKm ?? NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM}`}
            />
            {finalData.hasAC && (
              <DetailsLineItem
                label={t("ACChagePerDay")}
                value={`${finalData.defaultAcChargePerDay ?? NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY}`}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoDefaultButton
          size={"lg"}
          type="submit"
          disabled={formData.formState.isSubmitting}
          showSpinner={formData.formState.isSubmitting}
          label={
            formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
          }
        />
        <RyogoOutlineButton
          size={"lg"}
          type="button"
          onClick={onPrev}
          disabled={formData.formState.isSubmitting}
          label={t("SecondaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}

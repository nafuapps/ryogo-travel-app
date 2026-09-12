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
    const newVehicleData: AddVehicleRequestType = {
      agencyId: finalData.agencyId,
      addedByUserId: finalData.addedByUserId,
      data: {
        vehicleNumber: finalData.data.vehicleNumber,
        type: finalData.data.type,
        brand: finalData.data.brand,
        color: finalData.data.color,
        model: finalData.data.model,
        capacity: finalData.data.capacity,
        odometerReading: finalData.data.odometerReading,
        insuranceExpiresOn: finalData.data.insuranceExpiresOn,
        pucExpiresOn: finalData.data.pucExpiresOn,
        rcExpiresOn: finalData.data.rcExpiresOn,
        hasAC: finalData.data.hasAC,
        defaultRatePerKm: finalData.data.defaultRatePerKm,
        defaultAcChargePerDay: finalData.data.defaultAcChargePerDay,
        rcPhotos: finalData.data.rcPhotos,
        pucPhotos: finalData.data.pucPhotos,
        insurancePhotos: finalData.data.insurancePhotos,
        vehiclePhotos: finalData.data.vehiclePhotos,
      },
    }
    if (await addVehicleAction(newVehicleData)) {
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
              value={finalData.data.vehicleNumber.toUpperCase()}
            />
            <DetailsLineItem
              label={t("Type")}
              value={finalData.data.type.toUpperCase()}
            />
            <DetailsLineItem label={t("Brand")} value={finalData.data.brand} />
            <DetailsLineItem label={t("Model")} value={finalData.data.model} />
            <DetailsLineItem label={t("Color")} value={finalData.data.color} />
            <DetailsLineItem
              label={t("HasAC")}
              value={finalData.data.hasAC ? "Yes" : "No"}
            />
            {finalData.data.capacity && (
              <DetailsLineItem
                label={t("Capacity")}
                value={`${finalData.data.capacity}`}
              />
            )}
            {finalData.data.odometerReading && (
              <DetailsLineItem
                label={t("OdometerReading")}
                value={`${finalData.data.odometerReading}`}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("PolicyDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            {finalData.data.rcExpiresOn && (
              <DetailsLineItem
                label={t("RCExpiresOn")}
                value={moment(finalData.data.rcExpiresOn).format("DD MMM YYYY")}
              />
            )}
            {finalData.data.insuranceExpiresOn && (
              <DetailsLineItem
                label={t("InsuranceExpiresOn")}
                value={moment(finalData.data.insuranceExpiresOn).format(
                  "DD MMM YYYY",
                )}
              />
            )}
            {finalData.data.pucExpiresOn && (
              <DetailsLineItem
                label={t("PUCExpiresOn")}
                value={moment(finalData.data.pucExpiresOn).format(
                  "DD MMM YYYY",
                )}
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
              value={`${finalData.data.defaultRatePerKm ?? NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM}`}
            />
            {finalData.data.hasAC && (
              <DetailsLineItem
                label={t("ACChagePerDay")}
                value={`${finalData.data.defaultAcChargePerDay ?? NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY}`}
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

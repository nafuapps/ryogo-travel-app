"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
  DetailsLineItem,
} from "@/components/page/pageWrappers"
import {
  AddVehicleTotalSteps,
  NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
  NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
} from "@/lib/uiConfig"
import FormStepHeader from "@/components/form/formStepHeader"
import { RyogoCaption } from "@/components/typography"
import moment from "moment"

export function NewVehicleConfirm({
  onPrev,
  newVehicleFormData,
  agencyId,
  userId,
}: {
  onPrev: () => void
  newVehicleFormData: AddVehicleRequestType
  agencyId: string
  userId: string
}) {
  const t = useTranslations("Dashboard.NewVehicle.Confirm")
  const form = useForm<AddVehicleRequestType>()
  const router = useRouter()

  const onSubmit = async () => {
    const newVehicleData: AddVehicleRequestType = {
      agencyId: agencyId,
      addedByUserId: userId,
      vehicleNumber: newVehicleFormData.vehicleNumber,
      type: newVehicleFormData.type,
      brand: newVehicleFormData.brand,
      color: newVehicleFormData.color,
      model: newVehicleFormData.model,
      capacity: newVehicleFormData.capacity,
      odometerReading: newVehicleFormData.odometerReading,
      insuranceExpiresOn: newVehicleFormData.insuranceExpiresOn,
      pucExpiresOn: newVehicleFormData.pucExpiresOn,
      rcExpiresOn: newVehicleFormData.rcExpiresOn,
      hasAC: newVehicleFormData.hasAC,
      defaultRatePerKm: newVehicleFormData.defaultRatePerKm,
      defaultAcChargePerDay: newVehicleFormData.defaultAcChargePerDay,
      insurancePhotos: newVehicleFormData.insurancePhotos,
      pucPhotos: newVehicleFormData.pucPhotos,
      rcPhotos: newVehicleFormData.rcPhotos,
      vehiclePhotos: newVehicleFormData.vehiclePhotos,
    }
    const addedVehicle = await addVehicleAction(newVehicleData)

    if (addedVehicle) {
      toast.success(t("APISuccess"))
      router.replace(`/dashboard/vehicles/${addedVehicle.id}?feedback=true`)
    } else {
      toast.error(t("APIError"))
      router.replace("/dashboard/vehicles")
    }
  }
  return (
    <PageWrapper id="NewVehicleConfirm">
      <FormStepHeader
        totalSteps={AddVehicleTotalSteps}
        currentStepIndex={4}
        title={t("Title")}
        stepLabel={t("Subtitle", {
          current: "5",
          total: AddVehicleTotalSteps.toString(),
        })}
        description={t("Description")}
        href={"/dashboard/support/help-vehicles#adding"}
      />
      <FormWrapper<AddVehicleRequestType>
        id="ConfirmForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light">{t("BasicDetails")}</RyogoCaption>
            </DetailsHeaderWrapper>
            <DetailsContentWrapper>
              <DetailsLineItem
                label={t("VehicleNumber")}
                value={newVehicleFormData.vehicleNumber}
              />
              <DetailsLineItem
                label={t("Type")}
                value={newVehicleFormData.type}
              />
              <DetailsLineItem
                label={t("Brand")}
                value={newVehicleFormData.brand}
              />
              <DetailsLineItem
                label={t("Model")}
                value={newVehicleFormData.model}
              />
              <DetailsLineItem
                label={t("Color")}
                value={newVehicleFormData.color}
              />
              {newVehicleFormData.capacity && (
                <DetailsLineItem
                  label={t("Capacity")}
                  value={`${newVehicleFormData.capacity}`}
                />
              )}
              {newVehicleFormData.odometerReading && (
                <DetailsLineItem
                  label={t("OdometerReading")}
                  value={`${newVehicleFormData.odometerReading}`}
                />
              )}
              <DetailsLineItem
                label={t("HasAC")}
                value={newVehicleFormData.hasAC ? "Yes" : "No"}
              />
            </DetailsContentWrapper>
          </DetailsBorderWrapper>
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light">{t("PolicyDetails")}</RyogoCaption>
            </DetailsHeaderWrapper>
            <DetailsContentWrapper>
              {newVehicleFormData.rcExpiresOn && (
                <DetailsLineItem
                  label={t("RCExpiresOn")}
                  value={moment(newVehicleFormData.rcExpiresOn).format(
                    "DD MMM YYYY",
                  )}
                />
              )}
              {newVehicleFormData.insuranceExpiresOn && (
                <DetailsLineItem
                  label={t("InsuranceExpiresOn")}
                  value={moment(newVehicleFormData.insuranceExpiresOn).format(
                    "DD MMM YYYY",
                  )}
                />
              )}
              {newVehicleFormData.pucExpiresOn && (
                <DetailsLineItem
                  label={t("PUCExpiresOn")}
                  value={moment(newVehicleFormData.pucExpiresOn).format(
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
                value={(
                  newVehicleFormData.defaultRatePerKm ??
                  NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM
                ).toString()}
              />
              {newVehicleFormData.hasAC && (
                <DetailsLineItem
                  label={t("ACChagePerDay")}
                  value={`${newVehicleFormData.defaultAcChargePerDay ?? NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY}`}
                />
              )}
            </DetailsContentWrapper>
          </DetailsBorderWrapper>
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("SecondaryCTA")}
            type="button"
            onClick={onPrev}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}

"use client"

import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import FormStepHeader from "@/components/form/formStepHeader"
import PreviewImage from "@/components/images/previewImage"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
  DetailsLineItem,
  DetailsLineWrapper,
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import {
  AddVehicleTotalSteps,
  NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
  NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
} from "@/lib/uiConfig"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import moment from "moment"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
    const addedVehicle = await addVehicleAction({
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
    })

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
              <DetailsLineItem
                label={t("HasAC")}
                value={newVehicleFormData.hasAC ? "Yes" : "No"}
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
              {newVehicleFormData.vehiclePhotos && (
                <DetailsLineWrapper label={t("VehiclePhoto")}>
                  <PreviewImage file={newVehicleFormData.vehiclePhotos} />
                </DetailsLineWrapper>
              )}
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
              {newVehicleFormData.rcPhotos && (
                <DetailsLineWrapper label={t("RCPhoto")}>
                  <PreviewImage file={newVehicleFormData.rcPhotos} />
                </DetailsLineWrapper>
              )}
              {newVehicleFormData.pucExpiresOn && (
                <DetailsLineItem
                  label={t("PUCExpiresOn")}
                  value={moment(newVehicleFormData.pucExpiresOn).format(
                    "DD MMM YYYY",
                  )}
                />
              )}
              {newVehicleFormData.pucPhotos && (
                <DetailsLineWrapper label={t("PUCPhoto")}>
                  <PreviewImage file={newVehicleFormData.pucPhotos} />
                </DetailsLineWrapper>
              )}
              {newVehicleFormData.insuranceExpiresOn && (
                <DetailsLineItem
                  label={t("InsuranceExpiresOn")}
                  value={moment(newVehicleFormData.insuranceExpiresOn).format(
                    "DD MMM YYYY",
                  )}
                />
              )}
              {newVehicleFormData.insurancePhotos && (
                <DetailsLineWrapper label={t("InsurancePhoto")}>
                  <PreviewImage file={newVehicleFormData.insurancePhotos} />
                </DetailsLineWrapper>
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

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
      data: {
        vehicleNumber: newVehicleFormData.data.vehicleNumber,
        type: newVehicleFormData.data.type,
        brand: newVehicleFormData.data.brand,
        color: newVehicleFormData.data.color,
        model: newVehicleFormData.data.model,
        capacity: newVehicleFormData.data.capacity,
        odometerReading: newVehicleFormData.data.odometerReading,
        insuranceExpiresOn: newVehicleFormData.data.insuranceExpiresOn,
        pucExpiresOn: newVehicleFormData.data.pucExpiresOn,
        rcExpiresOn: newVehicleFormData.data.rcExpiresOn,
        hasAC: newVehicleFormData.data.hasAC,
        defaultRatePerKm: newVehicleFormData.data.defaultRatePerKm,
        defaultAcChargePerDay: newVehicleFormData.data.defaultAcChargePerDay,
        insurancePhotos: newVehicleFormData.data.insurancePhotos,
        pucPhotos: newVehicleFormData.data.pucPhotos,
        rcPhotos: newVehicleFormData.data.rcPhotos,
        vehiclePhotos: newVehicleFormData.data.vehiclePhotos,
      },
    }
    const addedVehicle = await addVehicleAction(newVehicleData)

    if (addedVehicle) {
      toast.success(t("APISuccess"))
      router.replace(`/dashboard/vehicles/${addedVehicle.id}`)
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
          current: 5,
          total: AddVehicleTotalSteps,
        })}
        description={t("Description")}
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
                value={newVehicleFormData.data.vehicleNumber.toUpperCase()}
              />
              <DetailsLineItem
                label={t("Type")}
                value={newVehicleFormData.data.type.toUpperCase()}
              />
              <DetailsLineItem
                label={t("Brand")}
                value={newVehicleFormData.data.brand}
              />
              <DetailsLineItem
                label={t("Model")}
                value={newVehicleFormData.data.model}
              />
              <DetailsLineItem
                label={t("Color")}
                value={newVehicleFormData.data.color}
              />
              {newVehicleFormData.data.capacity && (
                <DetailsLineItem
                  label={t("Capacity")}
                  value={`${newVehicleFormData.data.capacity}`}
                />
              )}
              {newVehicleFormData.data.odometerReading && (
                <DetailsLineItem
                  label={t("OdometerReading")}
                  value={`${newVehicleFormData.data.odometerReading}`}
                />
              )}
              <DetailsLineItem
                label={t("HasAC")}
                value={newVehicleFormData.data.hasAC ? "Yes" : "No"}
              />
            </DetailsContentWrapper>
          </DetailsBorderWrapper>
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light">{t("PolicyDetails")}</RyogoCaption>
            </DetailsHeaderWrapper>
            <DetailsContentWrapper>
              {newVehicleFormData.data.rcExpiresOn && (
                <DetailsLineItem
                  label={t("RCExpiresOn")}
                  value={moment(newVehicleFormData.data.rcExpiresOn).format(
                    "DD MMM YYYY",
                  )}
                />
              )}
              {newVehicleFormData.data.insuranceExpiresOn && (
                <DetailsLineItem
                  label={t("InsuranceExpiresOn")}
                  value={moment(
                    newVehicleFormData.data.insuranceExpiresOn,
                  ).format("DD MMM YYYY")}
                />
              )}
              {newVehicleFormData.data.pucExpiresOn && (
                <DetailsLineItem
                  label={t("PUCExpiresOn")}
                  value={moment(newVehicleFormData.data.pucExpiresOn).format(
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
                  newVehicleFormData.data.defaultRatePerKm ??
                  NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM
                ).toString()}
              />
              {newVehicleFormData.data.hasAC && (
                <DetailsLineItem
                  label={t("ACChagePerDay")}
                  value={`${newVehicleFormData.data.defaultAcChargePerDay ?? NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY}`}
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

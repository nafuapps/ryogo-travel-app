"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import StepsTracker from "@/components/form/stepsTracker"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"
import ConfirmValues from "@/components/form/confirmValues"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export function NewVehicleConfirm({
  onPrev,
  newVehicleFormData,
  agencyId,
}: {
  onPrev: () => void
  newVehicleFormData: AddVehicleRequestType
  agencyId: string
}) {
  const t = useTranslations("Dashboard.NewVehicle.Confirm")
  const form = useForm<AddVehicleRequestType>()
  const router = useRouter()

  const onSubmit = async () => {
    const newVehicleData: AddVehicleRequestType = {
      agencyId: agencyId,
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
    <NewStepWrapper id="NewVehicleConfirm">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"vehicle"} current={4} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<AddVehicleRequestType>
        id="ConfirmForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
          <ConfirmValues
            name={t("VehicleNumber")}
            value={newVehicleFormData.data.vehicleNumber}
          />
          <ConfirmValues
            name={t("Type")}
            value={newVehicleFormData.data.type}
          />
          <ConfirmValues
            name={t("Brand")}
            value={newVehicleFormData.data.brand}
          />
          <ConfirmValues
            name={t("Model")}
            value={newVehicleFormData.data.model}
          />
          <ConfirmValues
            name={t("Color")}
            value={newVehicleFormData.data.color}
          />
          {newVehicleFormData.data.capacity && (
            <ConfirmValues
              name={t("Capacity")}
              value={`${newVehicleFormData.data.capacity}`}
            />
          )}
          {newVehicleFormData.data.odometerReading && (
            <ConfirmValues
              name={t("OdometerReading")}
              value={`${newVehicleFormData.data.odometerReading}`}
            />
          )}
          {newVehicleFormData.data.insuranceExpiresOn && (
            <ConfirmValues
              name={t("InsuranceExpiresOn")}
              value={newVehicleFormData.data.insuranceExpiresOn.toDateString()}
            />
          )}
          {newVehicleFormData.data.pucExpiresOn && (
            <ConfirmValues
              name={t("PUCExpiresOn")}
              value={newVehicleFormData.data.pucExpiresOn.toDateString()}
            />
          )}
          {newVehicleFormData.data.rcExpiresOn && (
            <ConfirmValues
              name={t("RCExpiresOn")}
              value={newVehicleFormData.data.rcExpiresOn.toDateString()}
            />
          )}
          {newVehicleFormData.data.defaultRatePerKm && (
            <ConfirmValues
              name={t("RatePerKm")}
              value={`${newVehicleFormData.data.defaultRatePerKm}`}
            />
          )}
          <ConfirmValues
            name={t("HasAC")}
            value={newVehicleFormData.data.hasAC ? "Yes" : "No"}
          />
          {newVehicleFormData.data.hasAC &&
            newVehicleFormData.data.defaultAcChargePerDay && (
              <ConfirmValues
                name={t("ACChagePerDay")}
                value={`${newVehicleFormData.data.defaultAcChargePerDay}`}
              />
            )}
        </NewFormContentWrapper>
        <NewFormActionWrapper>
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
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}

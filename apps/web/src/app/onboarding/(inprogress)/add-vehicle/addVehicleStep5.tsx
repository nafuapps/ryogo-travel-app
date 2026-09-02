"use client"

import { RyogoH3 } from "@/components/typography"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import ConfirmValues from "@/components/form/confirmValues"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

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
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step5Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step5Content">
          <RyogoH3 color="slate">{t("Title")}</RyogoH3>
          <ConfirmValues
            name={t("VehicleNumber")}
            value={finalData.data.vehicleNumber}
          />
          <ConfirmValues
            name={t("Type")}
            value={finalData.data.type.toUpperCase()}
          />
          <ConfirmValues name={t("Brand")} value={finalData.data.brand} />
          <ConfirmValues name={t("Model")} value={finalData.data.model} />
          <ConfirmValues name={t("Color")} value={finalData.data.color} />
          {finalData.data.capacity && (
            <ConfirmValues
              name={t("Capacity")}
              value={`${finalData.data.capacity}`}
            />
          )}
          {finalData.data.odometerReading && (
            <ConfirmValues
              name={t("OdometerReading")}
              value={`${finalData.data.odometerReading}`}
            />
          )}
          {finalData.data.insuranceExpiresOn && (
            <ConfirmValues
              name={t("InsuranceExpiresOn")}
              value={finalData.data.insuranceExpiresOn.toDateString()}
            />
          )}
          {finalData.data.pucExpiresOn && (
            <ConfirmValues
              name={t("PUCExpiresOn")}
              value={finalData.data.pucExpiresOn.toDateString()}
            />
          )}
          {finalData.data.rcExpiresOn && (
            <ConfirmValues
              name={t("RCExpiresOn")}
              value={finalData.data.rcExpiresOn.toDateString()}
            />
          )}
          {finalData.data.defaultRatePerKm && (
            <ConfirmValues
              name={t("RatePerKm")}
              value={`${finalData.data.defaultRatePerKm}`}
            />
          )}
          <ConfirmValues
            name={t("HasAC")}
            value={finalData.data.hasAC ? "Yes" : "No"}
          />
          {finalData.data.hasAC && finalData.data.defaultAcChargePerDay && (
            <ConfirmValues
              name={t("ACChagePerDay")}
              value={`${finalData.data.defaultAcChargePerDay}`}
            />
          )}
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step5Actions">
          <RyogoDefaultButton
            className="w-full"
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
            className="w-full"
            disabled={formData.formState.isSubmitting}
            label={t("SecondaryCTA")}
          />
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}

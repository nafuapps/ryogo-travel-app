import { H3Grey } from "@/components/typography"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import ConfirmValues from "@/app/onboarding/components/confirmValues"
import { AddVehicleFormDataType } from "@ryogo-travel-app/api/types/formDataTypes"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/app/onboarding/components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { addVehicleAction } from "./addVehicleAction"

export function AddVehicleConfirm(props: {
  onNext: () => void
  onPrev: () => void
  finalData: AddVehicleFormDataType
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Confirm")
  const router = useRouter()

  const formData = useForm<AddVehicleFormDataType>()

  //Submit actions
  const onSubmit = async () => {
    const newVehicleData: AddVehicleRequestType = {
      agencyId: props.finalData.agencyId,
      data: {
        vehicleNumber: props.finalData.vehicleNumber,
        type: props.finalData.type,
        brand: props.finalData.brand,
        color: props.finalData.color,
        model: props.finalData.model,
        capacity: props.finalData.capacity,
        odometerReading: props.finalData.odometerReading,
        insuranceExpiresOn: props.finalData.insuranceExpiresOn!,
        pucExpiresOn: props.finalData.pucExpiresOn!,
        rcExpiresOn: props.finalData.rcExpiresOn!,
        hasAC: props.finalData.hasAC,
        defaultRatePerKm: props.finalData.defaultRatePerKm,
        defaultAcChargePerDay: props.finalData.defaultAcChargePerDay,
        rcPhotos: props.finalData.rcPhotos,
        pucPhotos: props.finalData.pucPhotos,
        insurancePhotos: props.finalData.insurancePhotos,
        vehiclePhotos: props.finalData.vehiclePhotos,
      },
    }
    const addedVehicle = await addVehicleAction(newVehicleData)
    if (addedVehicle.id) {
      props.onNext()
    } else {
      //If failed, Take back to vehicle onboarding page and show error
      toast.error(t("APIError"))
      router.replace("/onboarding/add-vehicle")
    }
  }

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step5Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step5Content">
          <H3Grey>{t("Title")}</H3Grey>
          <ConfirmValues
            name={t("VehicleNumber")}
            value={props.finalData.vehicleNumber}
          />
          <ConfirmValues name={t("Type")} value={props.finalData.type} />
          <ConfirmValues name={t("Brand")} value={props.finalData.brand} />
          <ConfirmValues name={t("Model")} value={props.finalData.model} />
          <ConfirmValues name={t("Color")} value={props.finalData.color} />
          {props.finalData.capacity && (
            <ConfirmValues
              name={t("Capacity")}
              value={`${props.finalData.capacity}`}
            />
          )}
          {props.finalData.odometerReading && (
            <ConfirmValues
              name={t("OdometerReading")}
              value={`${props.finalData.odometerReading}`}
            />
          )}
          <ConfirmValues
            name={t("InsuranceExpiresOn")}
            value={props.finalData.insuranceExpiresOn!.toDateString()}
          />
          <ConfirmValues
            name={t("PUCExpiresOn")}
            value={props.finalData.pucExpiresOn!.toDateString()}
          />
          <ConfirmValues
            name={t("RCExpiresOn")}
            value={props.finalData.rcExpiresOn!.toDateString()}
          />
          {props.finalData.defaultRatePerKm && (
            <ConfirmValues
              name={t("RatePerKm")}
              value={`${props.finalData.defaultRatePerKm}`}
            />
          )}
          <ConfirmValues
            name={t("HasAC")}
            value={props.finalData.hasAC ? "Yes" : "No"}
          />
          {props.finalData.hasAC && props.finalData.defaultAcChargePerDay && (
            <ConfirmValues
              name={t("ACChagePerDay")}
              value={`${props.finalData.defaultAcChargePerDay}`}
            />
          )}
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step5Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
          <OnboardingStepSecondaryAction
            onClick={props.onPrev}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </OnboardingStepSecondaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}

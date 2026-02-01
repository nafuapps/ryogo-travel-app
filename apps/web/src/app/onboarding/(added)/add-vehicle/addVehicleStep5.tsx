import { H3Grey } from "@/components/typography"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import ConfirmValues from "@/app/onboarding/components/confirmValues"
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
import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"

export function AddVehicleConfirm(props: {
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
      agencyId: props.finalData.agencyId,
      data: {
        vehicleNumber: props.finalData.data.vehicleNumber,
        type: props.finalData.data.type,
        brand: props.finalData.data.brand,
        color: props.finalData.data.color,
        model: props.finalData.data.model,
        capacity: props.finalData.data.capacity,
        odometerReading: props.finalData.data.odometerReading,
        insuranceExpiresOn: props.finalData.data.insuranceExpiresOn,
        pucExpiresOn: props.finalData.data.pucExpiresOn,
        rcExpiresOn: props.finalData.data.rcExpiresOn,
        hasAC: props.finalData.data.hasAC,
        defaultRatePerKm: props.finalData.data.defaultRatePerKm,
        defaultAcChargePerDay: props.finalData.data.defaultAcChargePerDay,
        rcPhotos: props.finalData.data.rcPhotos,
        pucPhotos: props.finalData.data.pucPhotos,
        insurancePhotos: props.finalData.data.insurancePhotos,
        vehiclePhotos: props.finalData.data.vehiclePhotos,
      },
    }
    const addedVehicle = await addVehicleAction(newVehicleData)
    if (addedVehicle) {
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
            value={props.finalData.data.vehicleNumber}
          />
          <ConfirmValues name={t("Type")} value={props.finalData.data.type} />
          <ConfirmValues name={t("Brand")} value={props.finalData.data.brand} />
          <ConfirmValues name={t("Model")} value={props.finalData.data.model} />
          <ConfirmValues name={t("Color")} value={props.finalData.data.color} />
          {props.finalData.data.capacity && (
            <ConfirmValues
              name={t("Capacity")}
              value={`${props.finalData.data.capacity}`}
            />
          )}
          {props.finalData.data.odometerReading && (
            <ConfirmValues
              name={t("OdometerReading")}
              value={`${props.finalData.data.odometerReading}`}
            />
          )}
          {props.finalData.data.insuranceExpiresOn && (
            <ConfirmValues
              name={t("InsuranceExpiresOn")}
              value={props.finalData.data.insuranceExpiresOn.toDateString()}
            />
          )}
          {props.finalData.data.pucExpiresOn && (
            <ConfirmValues
              name={t("PUCExpiresOn")}
              value={props.finalData.data.pucExpiresOn.toDateString()}
            />
          )}
          {props.finalData.data.rcExpiresOn && (
            <ConfirmValues
              name={t("RCExpiresOn")}
              value={props.finalData.data.rcExpiresOn.toDateString()}
            />
          )}
          {props.finalData.data.defaultRatePerKm && (
            <ConfirmValues
              name={t("RatePerKm")}
              value={`${props.finalData.data.defaultRatePerKm}`}
            />
          )}
          <ConfirmValues
            name={t("HasAC")}
            value={props.finalData.data.hasAC ? "Yes" : "No"}
          />
          {props.finalData.data.hasAC &&
            props.finalData.data.defaultAcChargePerDay && (
              <ConfirmValues
                name={t("ACChagePerDay")}
                value={`${props.finalData.data.defaultAcChargePerDay}`}
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

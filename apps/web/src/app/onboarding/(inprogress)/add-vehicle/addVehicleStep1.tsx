"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoInput, RyogoSelect } from "@/components/form/ryogoFormFields"
import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepForm,
  OnboardingStepPrimaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { useTranslations } from "next-intl"
import {
  VehicleTypesEnum,
  VehicleBrandEnum,
  VehicleColorEnum,
} from "@ryogo-travel-app/db/schema"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import QuickAddVehicleAlertButton from "@/components/buttons/alert/quickAddVehicleAlertButton"

export function AddVehicleStep1(props: {
  onNext: () => void
  finalData: AddVehicleRequestType
  updateFinalData: Dispatch<SetStateAction<AddVehicleRequestType>>
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Step1")
  const step1Schema = z.object({
    vehicleNumber: z
      .string()
      .trim()
      .min(7, t("Field1.Error1"))
      .max(15, t("Field1.Error2")),
    type: z.enum(VehicleTypesEnum).nonoptional(t("Field2.Error1")),
    brand: z.enum(VehicleBrandEnum).nonoptional(t("Field3.Error1")),
    color: z.enum(VehicleColorEnum).nonoptional(t("Field4.Error1")),
    model: z.string().min(3, t("Field5.Error1")).max(30, t("Field5.Error2")),
  })
  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      vehicleNumber: props.finalData.data.vehicleNumber,
      type: props.finalData.data.type,
      brand: props.finalData.data.brand,
      color: props.finalData.data.color,
      model: props.finalData.data.model,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    props.updateFinalData({
      agencyId: props.finalData.agencyId,
      data: {
        ...props.finalData.data,
        vehicleNumber: data.vehicleNumber,
        type: data.type,
        brand: data.brand,
        color: data.color,
        model: data.model,
      },
    })
    props.onNext()
  }

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step1Content">
          <RyogoInput
            name={"vehicleNumber"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoSelect
            name={"type"}
            register={formData.register("type")}
            array={getEnumValueDisplayPairs(VehicleTypesEnum)}
            title={t("Field2.Title")}
            placeholder={t("Field2.Title")}
          />
          <RyogoSelect
            name={"brand"}
            register={formData.register("brand")}
            array={getEnumValueDisplayPairs(VehicleBrandEnum)}
            title={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
          />
          <RyogoSelect
            name={"color"}
            register={formData.register("color")}
            array={getEnumValueDisplayPairs(VehicleColorEnum)}
            title={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
          />
          <RyogoInput
            name={"model"}
            type="text"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
          <QuickAddVehicleAlertButton
            agencyId={props.finalData.agencyId}
            vehicleNumber={formData.getValues("vehicleNumber")}
            type={formData.getValues("type")}
            brand={formData.getValues("brand")}
            color={formData.getValues("color")}
            model={formData.getValues("model")}
            disabled={
              !formData.formState.isValid || formData.formState.isSubmitting
            }
            isOnboarding
          />
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { RyogoInput, RyogoSwitch } from "@/components/form/ryogoFormFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export function AddVehicleStep4({
  onNext,
  onPrev,
  finalData,
  updateFinalData,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: AddVehicleRequestType
  updateFinalData: Dispatch<SetStateAction<AddVehicleRequestType>>
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Step4")
  const step4Schema = z.object({
    defaultRatePerKm: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(0, t("Field1.Error2"))
      .max(50, t("Field1.Error3"))
      .nonnegative(t("Field1.Error4"))
      .multipleOf(1, t("Field1.Error5"))
      .optional(),
    hasAC: z.boolean(),
    defaultAcChargePerDay: z.coerce
      .number<number>()
      .min(0, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .nonnegative(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5"))
      .optional(),
  })
  type Step4Type = z.infer<typeof step4Schema>
  const formData = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      defaultRatePerKm: finalData.data.defaultRatePerKm,
      hasAC: finalData.data.hasAC,
      defaultAcChargePerDay: finalData.data.defaultAcChargePerDay,
    },
  })

  const acWatch = useWatch({
    name: "hasAC",
    control: formData.control,
  })

  //Submit actions
  const onSubmit = (data: Step4Type) => {
    updateFinalData({
      agencyId: finalData.agencyId,
      data: {
        ...finalData.data,
        defaultRatePerKm: data.defaultRatePerKm,
        hasAC: data.hasAC,
        defaultAcChargePerDay: data.defaultAcChargePerDay,
      },
    })
    onNext()
  }
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step4Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <RyogoInput
            name={"defaultRatePerKm"}
            type="tel"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoSwitch name={"hasAC"} label={t("Field2.Title")} />
          <RyogoInput
            name={"defaultAcChargePerDay"}
            type="tel"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
            disabled={!acWatch}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step4Actions">
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

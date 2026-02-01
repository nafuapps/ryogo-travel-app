import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  OnboardingInput,
  OnboardingMultipleCheckbox,
  OnboardingTextarea,
} from "@/app/onboarding/components/onboardingFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepSecondaryAction,
  OnboardingStepPrimaryAction,
} from "@/app/onboarding/components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"

export function AddDriverStep3(props: {
  onNext: () => void
  onPrev: () => void
  finalData: AddDriverRequestType
  updateFinalData: Dispatch<SetStateAction<AddDriverRequestType>>
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Step3")
  const step3Schema = z.object({
    driverAddress: z
      .string()
      .min(20, t("Field1.Error1"))
      .max(300, t("Field1.Error2")),
    canDriveVehicleTypes: z
      .array(z.enum(VehicleTypesEnum))
      .min(1, t("Field2.Error1")),
    defaultAllowancePerDay: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(1, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .positive(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5")),
  })
  type Step3Type = z.infer<typeof step3Schema>
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      driverAddress: props.finalData.data.address,
      canDriveVehicleTypes: props.finalData.data.canDriveVehicleTypes,
      defaultAllowancePerDay: props.finalData.data.defaultAllowancePerDay,
    },
  })

  //Submit actions
  const onSubmit = (data: Step3Type) => {
    props.updateFinalData({
      agencyId: props.finalData.agencyId,
      data: {
        ...props.finalData.data,
        address: data.driverAddress,
        canDriveVehicleTypes: data.canDriveVehicleTypes,
        defaultAllowancePerDay: data.defaultAllowancePerDay,
      },
    })
    props.onNext()
  }

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step3Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step3Content">
          <OnboardingTextarea
            name={"driverAddress"}
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
          />
          <OnboardingMultipleCheckbox
            array={getEnumValueDisplayPairs(VehicleTypesEnum)}
            name={"canDriveVehicleTypes"}
            label={t("Field2.Title")}
            register={formData.register("canDriveVehicleTypes")}
          />
          <OnboardingInput
            name={"defaultAllowancePerDay"}
            type="tel"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step3Actions">
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

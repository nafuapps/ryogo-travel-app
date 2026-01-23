import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { CreateAccountFormDataType } from "@ryogo-travel-app/api/types/formDataTypes"
import { OnboardingInput } from "../components/onboardingFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "../components/onboardingSteps"
import { Form } from "@/components/ui/form"

export function CreateAccountStep4(props: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateAccountFormDataType
  updateFinalData: Dispatch<SetStateAction<CreateAccountFormDataType>>
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Step4")
  const step4Schema = z
    .object({
      password: z
        .string()
        .min(8, t("Field1.Error1"))
        .refine((s) => !s.includes(" "), t("Field1.Error2")),
      confirmPassword: z
        .string()
        .min(8, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error3")),
    })
    .refine((data) => data.password == data.confirmPassword, {
      message: t("Field2.Error2"),
      path: ["confirmPassword"], // path of error
    })
  type Step4Type = z.infer<typeof step4Schema>
  const formData = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      password: props.finalData.password,
      confirmPassword: props.finalData.confirmPassword,
    },
  })

  //Submit actions
  const onSubmit = (data: Step4Type) => {
    props.updateFinalData({
      ...props.finalData,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
    props.onNext()
  }
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step4Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <OnboardingInput
            name={"password"}
            type="password"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingInput
            name={"confirmPassword"}
            type="password"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step4Actions">
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

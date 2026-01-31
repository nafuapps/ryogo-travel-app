import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { OnboardingInput } from "@/app/onboarding/components/onboardingFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
} from "@/app/onboarding/components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { changePasswordAction } from "@/app/actions/users/changePasswordAction"

export function ChangePasswordStep1(props: {
  userId: string
  role: UserRolesEnum
}) {
  const t = useTranslations("Onboarding.ChangePasswordPage.Step1")
  const router = useRouter()

  const step1Schema = z
    .object({
      oldPassword: z
        .string()
        .min(8, t("Field1.Error1"))
        .refine((s) => !s.includes(" "), t("Field1.Error2")),
      newPassword: z
        .string()
        .min(8, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error2")),
      confirmPassword: z
        .string()
        .min(8, t("Field3.Error1"))
        .refine((s) => !s.includes(" "), t("Field3.Error2")),
    })
    .refine((data) => data.newPassword != data.oldPassword, {
      message: t("Field2.Error3"),
      path: ["newPassword"], // path of error
    })
    .refine((data) => data.newPassword == data.confirmPassword, {
      message: t("Field3.Error3"),
      path: ["confirmPassword"], // path of error
    })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    //Change password in DB
    const result = await changePasswordAction(
      props.userId,
      data.oldPassword,
      data.newPassword,
      true,
    )
    if (result) {
      //If success, redirect
      toast.success(t("Success"))
      if (props.role == UserRolesEnum.DRIVER) {
        router.replace("/rider")
      } else {
        router.replace("/dashboard")
      }
    } else {
      //If failed, show error
      formData.setError("oldPassword", {
        type: "manual",
        message: t("APIError"),
      })
      // formData.reset();
    }
  }

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <OnboardingInput
            name={"oldPassword"}
            type="password"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingInput
            name={"newPassword"}
            type="password"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingInput
            name={"confirmPassword"}
            type="password"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoOTPInput } from "@/components/form/ryogoFormFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { useTransition } from "react"
import { toast } from "sonner"
import { resendVerificationCodeAction } from "@/app/actions/users/resendCodeAction"
import { RyogoCaption } from "@/components/typography"
import { SUPPORT_EMAIL, VERIFY_CODE_TIMEOUT_MINUTES } from "@/lib/uiConfig"
import Link from "next/link"

export function VerifyAccountStep1(props: {
  onNext: () => void
  resendDifference: number
  code: string
}) {
  const t = useTranslations("Onboarding.VerifyAccountPage.Step1")
  const [isPending, startTransition] = useTransition()

  const step1Schema = z.object({
    userEnteredcode: z.string().length(6, t("Field1.Error1")),
  })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      userEnteredcode: "",
    },
  })

  //Submit actions
  const onSubmit = (data: Step1Type) => {
    setTimeout(() => {
      formData.setValue("userEnteredcode", "")
    }, 1000)
    if (data.userEnteredcode === props.code) {
      props.onNext()
    } else {
      formData.setError("userEnteredcode", {
        type: "manual",
        message: t("APIError"),
      })
    }
  }

  //Submit actions
  const resendCode = async () => {
    startTransition(async () => {
      if (await resendVerificationCodeAction()) {
        toast.success(t("ResendSuccess"))
      } else {
        toast.error(t("ResendError"))
      }
    })
  }
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step1Content">
          <RyogoOTPInput
            name={"userEnteredcode"}
            type="tel"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <OnboardingStepPrimaryAction disabled={isPending}>
            {t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
          <OnboardingStepSecondaryAction
            onClick={resendCode}
            disabled={
              isPending || props.resendDifference < VERIFY_CODE_TIMEOUT_MINUTES
            }
          >
            {isPending
              ? t("Sending")
              : props.resendDifference >= VERIFY_CODE_TIMEOUT_MINUTES
                ? t("SecondaryCTA")
                : t("Timeout", {
                    difference:
                      VERIFY_CODE_TIMEOUT_MINUTES - props.resendDifference,
                  })}
          </OnboardingStepSecondaryAction>
          <Link href={`mailto:${SUPPORT_EMAIL}`}>
            <RyogoCaption color="light">{t("Help")}</RyogoCaption>
          </Link>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}

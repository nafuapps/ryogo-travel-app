import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/components/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { useTransition } from "react"
import { toast } from "sonner"
import { verifyAccountAction } from "@/app/actions/users/verifyAccountAction"
import { resendCodeAction } from "@/app/actions/users/resendCodeAction"
import { CaptionGrey } from "@/components/typography"

const RESEND_TIMEOUT_MINUTES = 5

export function VerifyAccountStep1(props: {
  onNext: () => void
  resendDifference: number
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
  const onSubmit = async (data: Step1Type) => {
    startTransition(async () => {
      if (await verifyAccountAction(data.userEnteredcode)) {
        props.onNext()
        toast.success(t("VerifySuccess"))
      } else {
        toast.error(t("APIError"))
      }
    })
  }

  //Submit actions
  const resendCode = async () => {
    startTransition(async () => {
      if (await resendCodeAction()) {
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
          <RyogoInput
            name={"userEnteredcode"}
            type="tel"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <OnboardingStepPrimaryAction disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
          <OnboardingStepSecondaryAction
            onClick={resendCode}
            disabled={
              isPending || props.resendDifference < RESEND_TIMEOUT_MINUTES
            }
          >
            {isPending
              ? t("Sending")
              : props.resendDifference >= RESEND_TIMEOUT_MINUTES
                ? t("SecondaryCTA")
                : t("Timeout", {
                    difference: RESEND_TIMEOUT_MINUTES - props.resendDifference,
                  })}
          </OnboardingStepSecondaryAction>
          <CaptionGrey>{t("Help")}</CaptionGrey>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}

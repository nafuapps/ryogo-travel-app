import { RyogoH3, RyogoP, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
} from "@/components/flows/onboarding/onboardingSteps"
import { useRouter } from "next/navigation"
import { verifyAccountAction } from "@/app/actions/users/verifyAccountAction"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { useForm } from "react-hook-form"

export function VerifyAccountFinish() {
  const t = useTranslations("Onboarding.VerifyAccountPage.Finish")
  const router = useRouter()
  const form = useForm()

  const onSubmit = async () => {
    //Verify user in cookies and take to vehicle onboarding
    await verifyAccountAction()
    router.push("/onboarding/add-vehicle")
  }

  return (
    <OnboardingStepForm formId="Step2Form" submit={form.handleSubmit(onSubmit)}>
      <OnboardingStepContent contentId="Step2Content" success>
        <OnboardingSuccessIcon />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoP>{t("Subtitle")}</RyogoP>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step2Actions">
        <RyogoP>{t("Description1")}</RyogoP>
        <RyogoCaption color="light">{t("Description2")}</RyogoCaption>
        <RyogoDefaultButton
          size={"lg"}
          type="submit"
          disabled={form.formState.isSubmitting}
          label={t("PrimaryCTA")}
        />
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

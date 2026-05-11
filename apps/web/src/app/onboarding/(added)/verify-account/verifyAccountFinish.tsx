import { RyogoH3, RyogoP, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import Link from "next/link"
export function VerifyAccountFinish() {
  const t = useTranslations("Onboarding.VerifyAccountPage.Finish")

  return (
    <OnboardingStepForm formId="Step2Form">
      <OnboardingStepContent contentId="Step2Content">
        <OnboardingSuccessIcon iconId="Step2Icon" />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoP>{t("Subtitle")}</RyogoP>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step2Actions">
        <RyogoP>{t("Description1")}</RyogoP>
        <RyogoCaption color="light">{t("Description2")}</RyogoCaption>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-vehicle">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

import { RyogoH3, RyogoH4, RyogoP } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "@/components/onboarding/onboardingSteps"
import Link from "next/link"
export function CreateAccountFinish() {
  const t = useTranslations("Onboarding.CreateAccountPage.Finish")

  return (
    <OnboardingStepForm formId="Step6Form">
      <OnboardingStepContent contentId="Step6Content">
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoH4>{t("Subtitle")}</RyogoH4>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <RyogoP>{t("Description1")}</RyogoP>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/verify-account">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

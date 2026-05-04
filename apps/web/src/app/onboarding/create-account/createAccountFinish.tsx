import { H3, H5, P } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepFinishContent,
  OnboardingStepActions,
  OnboardingStepFinishForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "@/components/onboarding/onboardingSteps"
import Link from "next/link"
export function CreateAccountFinish() {
  const t = useTranslations("Onboarding.CreateAccountPage.Finish")

  return (
    <OnboardingStepFinishForm formId="Step6Form">
      <OnboardingStepFinishContent contentId="Step6Content">
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <H3>{t("Title")}</H3>
        <H5>{t("Subtitle")}</H5>
      </OnboardingStepFinishContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <P>{t("Description1")}</P>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/verify-account">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepFinishForm>
  )
}

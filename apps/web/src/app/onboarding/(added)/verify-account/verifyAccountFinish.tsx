import { H3, H5, P, CaptionGrey } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "@/components/onboarding/onboardingSteps"
import Link from "next/link"
export function VerifyAccountFinish() {
  const t = useTranslations("Onboarding.VerifyAccountPage.Finish")

  return (
    <OnboardingStepForm formId="Step2Form">
      <OnboardingStepContent contentId="Step2Content">
        <OnboardingSuccessIcon iconId="Step2Icon" />
        <H3>{t("Title")}</H3>
        <H5>{t("Subtitle")}</H5>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step2Actions">
        <P>{t("Description1")}</P>
        <CaptionGrey>{t("Description2")}</CaptionGrey>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-vehicle">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

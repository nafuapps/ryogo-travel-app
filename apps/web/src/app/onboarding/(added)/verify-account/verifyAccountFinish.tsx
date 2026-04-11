import { H3, H5, P, CaptionGrey } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepFinishContent,
  OnboardingStepActions,
  OnboardingStepFinishForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "../../components/onboardingSteps"
import Link from "next/link"
export function VerifyAccountFinish() {
  const t = useTranslations("Onboarding.VerifyAccountPage.Finish")

  return (
    <OnboardingStepFinishForm formId="Step2Form">
      <OnboardingStepFinishContent contentId="Step2Content">
        <OnboardingSuccessIcon iconId="Step2Icon" />
        <H3>{t("Title")}</H3>
        <H5>{t("Subtitle")}</H5>
      </OnboardingStepFinishContent>
      <OnboardingStepActions actionsId="Step2Actions">
        <P>{t("Description1")}</P>
        <CaptionGrey>{t("Description2")}</CaptionGrey>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-vehicle">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepFinishForm>
  )
}

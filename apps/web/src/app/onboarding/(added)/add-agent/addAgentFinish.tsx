import { H3, H5, PGrey } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepFinishContent,
  OnboardingStepActions,
  OnboardingStepFinishForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "@/app/onboarding/components/onboardingSteps"
import Link from "next/link"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"

export function AddAgentFinish(props: { finalData: AddAgentRequestType }) {
  const t = useTranslations("Onboarding.AddAgentPage.Finish")

  return (
    <OnboardingStepFinishForm formId="Step6Form">
      <OnboardingStepFinishContent contentId="Step6Content">
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <H3>{t("Title")}</H3>
        <H5>{t("Subtitle")}</H5>
        <PGrey>{t("Email", { email: props.finalData.data.email })}</PGrey>
      </OnboardingStepFinishContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/dashboard">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepFinishForm>
  )
}

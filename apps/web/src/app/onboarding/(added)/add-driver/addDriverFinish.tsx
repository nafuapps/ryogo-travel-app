import { H3, H5, P, CaptionGrey, PGrey } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepFinishContent,
  OnboardingStepActions,
  OnboardingStepFinishForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/components/onboarding/onboardingSteps"
import Link from "next/link"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"

export function AddDriverFinish(props: { finalData: AddDriverRequestType }) {
  const t = useTranslations("Onboarding.AddDriverPage.Finish")

  return (
    <OnboardingStepFinishForm formId="Step6Form">
      <OnboardingStepFinishContent contentId="Step6Content">
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <H3>{t("Title")}</H3>
        <H5>{t("Subtitle")}</H5>
        <PGrey>{t("Email", { email: props.finalData.data.email })}</PGrey>
      </OnboardingStepFinishContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <P>{t("Description1")}</P>
        <CaptionGrey>{t("Description2")}</CaptionGrey>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-agent">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
        <OnboardingStepSecondaryAction disabled={false}>
          <Link href="/dashboard">{t("SecondaryCTA")}</Link>
        </OnboardingStepSecondaryAction>
      </OnboardingStepActions>
    </OnboardingStepFinishForm>
  )
}

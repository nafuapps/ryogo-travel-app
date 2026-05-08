import { RyogoH3, RyogoH4, RyogoP } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import Link from "next/link"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"

export function AddAgentFinish(props: { finalData: AddAgentRequestType }) {
  const t = useTranslations("Onboarding.AddAgentPage.Finish")

  return (
    <OnboardingStepForm formId="Step6Form">
      <OnboardingStepContent contentId="Step6Content">
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoH4>{t("Subtitle")}</RyogoH4>
        <RyogoP color="slate">
          {t("Email", { email: props.finalData.data.email })}
        </RyogoP>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/dashboard">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

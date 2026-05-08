import { RyogoH3, RyogoH4, RyogoP, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import Link from "next/link"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"

export function AddDriverFinish(props: { finalData: AddDriverRequestType }) {
  const t = useTranslations("Onboarding.AddDriverPage.Finish")

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
        <RyogoP>{t("Description1")}</RyogoP>
        <RyogoCaption color="light">{t("Description2")}</RyogoCaption>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-agent">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
        <OnboardingStepSecondaryAction disabled={false}>
          <Link href="/dashboard">{t("SecondaryCTA")}</Link>
        </OnboardingStepSecondaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

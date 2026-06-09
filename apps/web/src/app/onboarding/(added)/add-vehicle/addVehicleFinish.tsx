import { RyogoH3, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import Link from "next/link"
export function AddVehicleFinish() {
  const t = useTranslations("Onboarding.AddVehiclePage.Finish")

  return (
    <OnboardingStepForm formId="Step6Form">
      <OnboardingStepContent contentId="Step6Content" success>
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <RyogoSmall>{t("Description1")}</RyogoSmall>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-driver">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

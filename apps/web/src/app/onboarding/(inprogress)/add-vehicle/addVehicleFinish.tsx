import { RyogoH3, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
} from "@/components/flows/onboarding/onboardingSteps"
import Link from "next/link"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export function AddVehicleFinish() {
  const t = useTranslations("Onboarding.AddVehiclePage.Finish")

  return (
    <OnboardingStepForm formId="Step6Form">
      <OnboardingStepContent contentId="Step6Content" success>
        <OnboardingSuccessIcon />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <RyogoSmall>{t("Description1")}</RyogoSmall>
        <Link href="/onboarding/add-driver">
          <RyogoDefaultButton label={t("PrimaryCTA")} />
        </Link>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

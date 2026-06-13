import { RyogoH3, RyogoP, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
} from "@/components/flows/onboarding/onboardingSteps"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { verifyAccountAction } from "@/app/actions/users/verifyAccountAction"

export function VerifyAccountFinish() {
  const t = useTranslations("Onboarding.VerifyAccountPage.Finish")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const goToVehicleOnboarding = async () => {
    startTransition(async () => {
      //Verify user in cookies and take to vehicle onboarding
      await verifyAccountAction()
      router.push("/onboarding/add-vehicle")
    })
  }

  return (
    <OnboardingStepForm formId="Step2Form">
      <OnboardingStepContent contentId="Step2Content" success>
        <OnboardingSuccessIcon iconId="Step2Icon" />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoP>{t("Subtitle")}</RyogoP>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step2Actions">
        <RyogoP>{t("Description1")}</RyogoP>
        <RyogoCaption color="light">{t("Description2")}</RyogoCaption>
        <Button
          variant={"default"}
          size={"lg"}
          disabled={isPending}
          onClick={goToVehicleOnboarding}
        >
          {t("PrimaryCTA")}
        </Button>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

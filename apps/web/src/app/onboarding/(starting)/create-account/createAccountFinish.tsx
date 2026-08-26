import { RyogoH3, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
} from "@/components/flows/onboarding/onboardingSteps"
import { useTransition } from "react"
import { loginAction } from "@/app/actions/users/loginAction"
import { useRouter } from "next/navigation"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export function CreateAccountFinish({
  id,
  password,
}: {
  id?: string
  password: string
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Finish")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const onSubmit = async () => {
    if (!id) {
      router.replace("/auth/login")
      return
    }
    startTransition(async () => {
      //Login the user and take to verification step
      const loginResult = await loginAction(id, password)
      if (loginResult.id) {
        router.replace("/onboarding/verify-account")
      }
    })
  }

  return (
    <OnboardingStepForm formId="Step6Form">
      <OnboardingStepContent contentId="Step6Content" success>
        <OnboardingSuccessIcon />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <RyogoSmall>{t("Description1")}</RyogoSmall>
        <RyogoDefaultButton
          disabled={isPending}
          onClick={onSubmit}
          type="submit"
          label={t("PrimaryCTA")}
        />
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

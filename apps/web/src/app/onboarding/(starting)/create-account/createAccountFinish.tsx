import { RyogoH3, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
} from "@/components/flows/onboarding/onboardingSteps"
import { loginAction } from "@/app/actions/users/loginAction"
import { useRouter } from "next/navigation"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { useForm } from "react-hook-form"
import { PasswordRegex } from "@/lib/regex"

export function CreateAccountFinish({
  password,
  id,
}: {
  password: string
  id?: string
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Finish")
  const router = useRouter()
  const form = useForm()

  const onSubmit = async () => {
    if (!id || !PasswordRegex.safeParse(password).success) {
      router.replace("/onboarding")
      return
    }
    //Login the user and take to verification step
    const loginResult = await loginAction(id, password)
    if (loginResult.id) {
      router.replace("/onboarding/verify-account")
    }
  }

  return (
    <OnboardingStepForm formId="Step6Form" submit={form.handleSubmit(onSubmit)}>
      <OnboardingStepContent contentId="Step6Content" success>
        <OnboardingSuccessIcon />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <RyogoSmall>{t("Description1")}</RyogoSmall>
        <RyogoDefaultButton
          disabled={form.formState.isSubmitting}
          onClick={onSubmit}
          type="submit"
          label={t("PrimaryCTA")}
        />
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

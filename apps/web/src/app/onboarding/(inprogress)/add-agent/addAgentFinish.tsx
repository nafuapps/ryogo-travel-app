import { RyogoH3, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
} from "@/components/flows/onboarding/onboardingSteps"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { Button } from "@/components/ui/button"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { MessageSquareShare } from "lucide-react"
import getAgentInviteMessage from "@/components/whatsapp/getAgentInviteMessage"
import { onboardingCompleteAction } from "@/app/actions/users/onboardingCompleteAction"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export function AddAgentFinish(props: {
  finalData: AddAgentRequestType
  agencyName: string
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Finish")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const goToDashboard = async () => {
    startTransition(async () => {
      //Activate user and take to dashboard
      await onboardingCompleteAction()
      router.push("/dashboard")
    })
  }

  const whatsappInviteLink = getAgentInviteMessage(
    props.finalData.data.phone,
    props.finalData.data.name,
    props.agencyName,
    props.finalData.data.email,
  )

  return (
    <OnboardingStepForm formId="Step6Form">
      <OnboardingStepContent contentId="Step6Content" success>
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
        <RyogoSmall color="slate">
          {t("Email", { email: props.finalData.data.email })}
        </RyogoSmall>
        <Button
          variant={"outline"}
          onClick={(e) => {
            e.preventDefault()
            window.open(whatsappInviteLink, "_blank", "noreferrer")
          }}
        >
          {t("SendInvite")}
          <RyogoIcon icon={MessageSquareShare} size="sm" />
        </Button>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <Button
          variant={"default"}
          size={"lg"}
          disabled={isPending}
          onClick={goToDashboard}
        >
          {t("PrimaryCTA")}
        </Button>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

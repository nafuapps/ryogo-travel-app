import { RyogoH3, RyogoP } from "@/components/typography"
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
import { Button } from "@/components/ui/button"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { MessageSquareShare } from "lucide-react"
import getAgentInviteMessage from "@/components/whatsapp/getAgentInviteMessage"

export function AddAgentFinish(props: {
  finalData: AddAgentRequestType
  agencyName: string
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Finish")

  const whatsappInviteLink = getAgentInviteMessage(
    props.finalData.data.phone,
    props.finalData.data.name,
    props.agencyName,
    props.finalData.data.email,
  )

  return (
    <OnboardingStepForm formId="Step6Form">
      <OnboardingStepContent contentId="Step6Content">
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoP>{t("Subtitle")}</RyogoP>
        <RyogoP color="slate">
          {t("Email", { email: props.finalData.data.email })}
        </RyogoP>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <Button
          variant={"outline"}
          onClick={() =>
            window.open(whatsappInviteLink, "_blank", "noreferrer")
          }
        >
          {t("SendInvite")}
          <RyogoIcon icon={MessageSquareShare} size="sm" />
        </Button>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/dashboard">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

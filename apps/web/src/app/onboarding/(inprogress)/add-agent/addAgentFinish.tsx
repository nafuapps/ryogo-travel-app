"use client"

import { RyogoH3, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
} from "@/components/flows/onboarding/onboardingSteps"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { MessageSquareShare } from "lucide-react"
import { onboardingCompleteAction } from "@/app/actions/users/onboardingCompleteAction"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

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
      router.push("/dashboard/home")
    })
  }

  const u = useTranslations("Dashboard.Whatsapp")
  const inviteLink = `${window.location.origin}/auth/login`
  const message = u("AgentInvite", {
    agentName: props.finalData.data.name,
    agencyName: props.agencyName,
    emailId: props.finalData.data.email,
    inviteLink: inviteLink,
  })

  const whatsappInviteLink = getWhatsappMessageLink(
    props.finalData.data.phone,
    message,
  )

  return (
    <OnboardingStepForm formId="FinishForm">
      <OnboardingStepContent contentId="FinishContent" success>
        <OnboardingSuccessIcon />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
        <RyogoSmall color="slate">
          {t("Email", { email: props.finalData.data.email })}
        </RyogoSmall>
        <RyogoOutlineButton
          onClick={(e) => {
            e.preventDefault()
            window.open(whatsappInviteLink, "_blank", "noreferrer")
          }}
          label={t("SendInvite")}
        >
          <RyogoIcon icon={MessageSquareShare} size="sm" />
        </RyogoOutlineButton>
      </OnboardingStepContent>
      <OnboardingStepActions actionsId="FinishActions">
        <RyogoOutlineButton
          size={"lg"}
          disabled={isPending}
          onClick={goToDashboard}
          label={t("PrimaryCTA")}
        />
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

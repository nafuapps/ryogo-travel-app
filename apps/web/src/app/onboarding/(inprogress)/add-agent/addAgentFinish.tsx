"use client"

import { RyogoH3, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { Check, MessageSquareShare } from "lucide-react"
import { onboardingCompleteAction } from "@/app/actions/users/onboardingCompleteAction"
import { useRouter } from "next/navigation"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { useForm } from "react-hook-form"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"

export function AddAgentFinish({
  finalData,
  agencyName,
}: {
  finalData: AddAgentRequestType
  agencyName: string
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Finish")
  const router = useRouter()
  const form = useForm()

  const submit = async () => {
    //Activate user and take to dashboard
    await onboardingCompleteAction()
    router.push("/dashboard/home")
  }

  const u = useTranslations("Dashboard.Whatsapp")
  const inviteLink = `${window.location.origin}/auth/login`
  const message = u("AgentInvite", {
    agentName: finalData.data.name,
    agencyName: agencyName,
    emailId: finalData.data.email,
    inviteLink: inviteLink,
  })

  const whatsappInviteLink = getWhatsappMessageLink(
    finalData.data.phone,
    message,
  )

  return (
    <FormWrapper
      id="AddAgentFinishForm"
      form={form}
      onSubmit={form.handleSubmit(submit)}
      justifyCenter
    >
      <FormContentWrapper asCard={false}>
        <RyogoEnclosedIcon
          icon={Check}
          size="md"
          color="white"
          bgColor="black"
          circular
        />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
        <RyogoSmall color="slate">
          {t("Email", { email: finalData.data.email })}
        </RyogoSmall>
        <RyogoOutlineButton
          type="button"
          onClick={(e) => {
            e.preventDefault()
            window.open(whatsappInviteLink, "_blank", "noreferrer")
          }}
          label={t("SendInvite")}
        >
          <RyogoIcon icon={MessageSquareShare} size="sm" />
        </RyogoOutlineButton>
      </FormContentWrapper>
      <StickyActionWrapper>
        <RyogoDefaultButton
          size={"lg"}
          disabled={form.formState.isSubmitting}
          type="submit"
          label={t("PrimaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}

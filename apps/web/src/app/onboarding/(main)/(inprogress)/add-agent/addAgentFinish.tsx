"use client"

import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH4, RyogoSmall } from "@/components/typography"
import { AddUserRequestType } from "@ryogo-travel-app/api/types/user.types"
import { Check, MessageSquareShare } from "lucide-react"
import { useTranslations } from "next-intl"
// import { onboardingCompleteAction } from "@/app/actions/users/onboardingCompleteAction"
// import { useRouter } from "next/navigation"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import Link from "next/link"
import { useForm } from "react-hook-form"

export function AddAgentFinish({
  finalData,
  agencyName,
}: {
  finalData: AddUserRequestType
  agencyName: string
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Finish")
  // const router = useRouter()
  const form = useForm()

  // const submit = async () => {
  //   //Activate user and take to dashboard
  //   await onboardingCompleteAction()
  //   router.replace("/dashboard/home?feedback=true")
  // }

  const u = useTranslations("Dashboard.Whatsapp")
  const inviteLink = `${window.location.origin}/auth/login`
  const message = u("AgentInvite", {
    agentName: finalData.name,
    agencyName: agencyName,
    emailId: finalData.email,
    inviteLink: inviteLink,
  })

  const whatsappInviteLink = getWhatsappMessageLink(finalData.phone, message)

  return (
    <FormWrapper
      id="AddAgentFinishForm"
      form={form}
      // onSubmit={form.handleSubmit(submit)}
      justifyCenter
    >
      <FormContentWrapper
        asCard={false}
        className="grow justify-center items-center"
      >
        <RyogoEnclosedIcon
          icon={Check}
          size="md"
          color="white"
          bgColor="black"
          circular
          className="animate-caret-blink"
        />
        <RyogoH4 className="text-center">{t("Title")}</RyogoH4>
        <RyogoSmall color="light" className="text-center">
          {t("Subtitle")}
        </RyogoSmall>
        <RyogoSmall color="slate" className="text-center">
          {t("Email", { email: finalData.email })}
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
      <StickyActionWrapper bgTransparent>
        <Link href="/dashboard/home?feedback=true" className="w-full">
          <RyogoDefaultButton
            size={"lg"}
            disabled={form.formState.isSubmitting}
            type="submit"
            label={t("PrimaryCTA")}
            className="w-full"
          />
        </Link>
      </StickyActionWrapper>
    </FormWrapper>
  )
}

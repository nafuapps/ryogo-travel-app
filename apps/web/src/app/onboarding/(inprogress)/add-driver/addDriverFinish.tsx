"use client"

import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import Link from "next/link"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { MessageSquareShare } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useTransition } from "react"
import { onboardingCompleteAction } from "@/app/actions/users/onboardingCompleteAction"
import { useRouter } from "next/navigation"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export function AddDriverFinish(props: {
  finalData: AddDriverRequestType
  agencyName: string
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Finish")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const goToDashboard = async () => {
    startTransition(async () => {
      //Activate user and take to dashboard
      await onboardingCompleteAction()
      router.push("/dashboard")
    })
  }

  const u = useTranslations("Dashboard.Whatsapp")
  const inviteLink = `${window.location.origin}/auth/login`
  const message = u("DriverInvite", {
    driverName: props.finalData.data.name,
    agencyName: props.agencyName,
    emailId: props.finalData.data.email,
    inviteLink: inviteLink,
  })

  const whatsappInviteLink = getWhatsappMessageLink(
    props.finalData.data.phone,
    message,
  )

  return (
    <OnboardingStepForm formId="Step6Form">
      <OnboardingStepContent contentId="Step6Content" success>
        <OnboardingSuccessIcon />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
        <RyogoCaption color="slate">
          {t("Email", { email: props.finalData.data.email })}
        </RyogoCaption>
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
      <OnboardingStepActions actionsId="Step6Actions">
        <RyogoSmall>{t("Description1")}</RyogoSmall>
        <RyogoCaption color="light">{t("Description2")}</RyogoCaption>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-agent">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
        <RyogoOutlineButton
          size={"lg"}
          disabled={isPending}
          onClick={goToDashboard}
          label={t("SecondaryCTA")}
        />
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

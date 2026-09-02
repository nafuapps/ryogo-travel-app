"use client"

import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
} from "@/components/flows/onboarding/onboardingSteps"
import Link from "next/link"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { MessageSquareShare } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { onboardingCompleteAction } from "@/app/actions/users/onboardingCompleteAction"
import { useRouter } from "next/navigation"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { useForm } from "react-hook-form"

export function AddDriverFinish({
  finalData,
  agencyName,
}: {
  finalData: AddDriverRequestType
  agencyName: string
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Finish")
  const router = useRouter()
  const form = useForm()

  const submit = async () => {
    //Activate user and take to dashboard
    await onboardingCompleteAction()
    router.push("/dashboard/home")
  }

  const u = useTranslations("Dashboard.Whatsapp")
  const inviteLink = `${window.location.origin}/auth/login`
  const message = u("DriverInvite", {
    driverName: finalData.data.name,
    agencyName: agencyName,
    emailId: finalData.data.email,
    inviteLink: inviteLink,
  })

  const whatsappInviteLink = getWhatsappMessageLink(
    finalData.data.phone,
    message,
  )

  return (
    <OnboardingStepForm formId="Step6Form" submit={form.handleSubmit(submit)}>
      <OnboardingStepContent contentId="Step6Content" success>
        <OnboardingSuccessIcon />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
        <RyogoCaption color="slate">
          {t("Email", { email: finalData.data.email })}
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
        <Link href="/onboarding/add-agent">
          <RyogoDefaultButton type="button" label={t("PrimaryCTA")} />
        </Link>
        <RyogoOutlineButton
          size={"lg"}
          disabled={form.formState.isSubmitting}
          type="submit"
          label={t("SecondaryCTA")}
        />
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

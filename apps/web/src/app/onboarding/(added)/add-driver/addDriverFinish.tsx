import { RyogoH3, RyogoP, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepForm,
  OnboardingSuccessIcon,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import Link from "next/link"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import getDriverInviteMessage from "@/components/whatsapp/getDriverInviteMessage"
import { Button } from "@/components/ui/button"
import { MessageSquareShare } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export function AddDriverFinish(props: {
  finalData: AddDriverRequestType
  agencyName: string
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Finish")

  const whatsappInviteLink = getDriverInviteMessage(
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
        <RyogoP>{t("Description1")}</RyogoP>
        <RyogoCaption color="light">{t("Description2")}</RyogoCaption>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-agent">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
        <Button
          variant={"outline"}
          onClick={() =>
            window.open(whatsappInviteLink, "_blank", "noreferrer")
          }
        >
          {t("SendInvite")}
          <RyogoIcon icon={MessageSquareShare} size="sm" />
        </Button>
        <OnboardingStepSecondaryAction>
          <Link href="/dashboard">{t("SecondaryCTA")}</Link>
        </OnboardingStepSecondaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

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
import getDriverInviteMessage from "@/components/whatsapp/getDriverInviteMessage"
import { Button } from "@/components/ui/button"
import { MessageSquareShare } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useTransition } from "react"
import { onboardingCompleteAction } from "@/app/actions/users/onboardingCompleteAction"

export function AddDriverFinish(props: {
  finalData: AddDriverRequestType
  agencyName: string
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Finish")
  const [isPending, startTransition] = useTransition()

  const goToDashboard = async () => {
    startTransition(async () => {
      //Activate user and take to dashboard
      await onboardingCompleteAction()
    })
  }

  const whatsappInviteLink = getDriverInviteMessage(
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
        <RyogoCaption color="slate">
          {t("Email", { email: props.finalData.data.email })}
        </RyogoCaption>
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
        <RyogoSmall>{t("Description1")}</RyogoSmall>
        <RyogoCaption color="light">{t("Description2")}</RyogoCaption>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-agent">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
        <Button
          variant={"secondary"}
          size={"lg"}
          disabled={isPending}
          onClick={goToDashboard}
        >
          {t("SecondaryCTA")}
        </Button>
      </OnboardingStepActions>
    </OnboardingStepForm>
  )
}

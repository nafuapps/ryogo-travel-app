"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { sendConfirmationAction } from "@/app/actions/bookings/sendConfirmationAction"
import { MessageSquareShare } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  RyogoOutlineButton,
  RyogoDefaultButton,
} from "@/components/buttons/ryogoButtons"
import { useRefreshPage } from "@/hooks/useRefreshPage"

export default function SendConfirmationAlertButton(props: {
  bookingId: string
  agencyId: string
  assignedUserId: string
  confirmationSentOn: Date | null
}) {
  const t = useTranslations("Dashboard.Buttons.SendConfirmation")
  const router = useRouter()

  const [isPending, startSendTransition] = useTransition()

  //Can send confirmation if either not sent before or sent more than X minutes ago
  const canSendConfirmation = useRefreshPage(props.confirmationSentOn)

  // Send confirmation to customer over whatsapp
  async function sendConfirmation() {
    startSendTransition(async () => {
      const confirmationMessage = await sendConfirmationAction(
        props.bookingId,
        props.agencyId,
        props.assignedUserId,
      )
      if (confirmationMessage) {
        toast.success(t("Success"))
        window.open(confirmationMessage, "_blank", "noopener,noreferrer")
        router.refresh()
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <RyogoAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={
        <RyogoOutlineButton label={t("Label")} disabled={!canSendConfirmation}>
          <RyogoIcon icon={MessageSquareShare} size="sm" />
        </RyogoOutlineButton>
      }
    >
      <RyogoDefaultButton
        onClick={sendConfirmation}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

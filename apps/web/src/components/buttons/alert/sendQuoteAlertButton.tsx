"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { useTransition } from "react"
import { sendQuoteAction } from "@/app/actions/bookings/sendQuoteAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { MessageSquareShare } from "lucide-react"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { useRefreshPage } from "@/hooks/useRefreshPage"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function SendQuoteAlertButton({
  bookingId,
  agencyId,
  assignedUserId,
  quoteSentOn,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
  quoteSentOn: Date | null
}) {
  const t = useTranslations("Dashboard.Buttons.SendQuote")
  const router = useRouter()
  const [isPending, startSendTransition] = useTransition()

  //Can send quote if either not sent before or sent more than X minutes ago
  const { canSend, refreshMinutes } = useRefreshPage(quoteSentOn)

  // Send quote to customer over whatsapp
  async function sendQuote() {
    startSendTransition(async () => {
      const quoteMessage = await sendQuoteAction(
        bookingId,
        agencyId,
        assignedUserId,
      )
      if (quoteMessage) {
        toast.success(t("Success"))
        window.open(quoteMessage, "_blank", "noopener,noreferrer")
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
        <RyogoDetailedIconButton
          label={t("Label")}
          icon={MessageSquareShare}
          subtitle={
            canSend ? t("Subtitle") : t("Disabled", { count: refreshMinutes })
          }
          disabled={!canSend}
        />
      }
    >
      <RyogoDefaultButton
        onClick={sendQuote}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { useTransition } from "react"
import { sendInvoiceAction } from "@/app/actions/bookings/sendInvoiceAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { MessageSquareShare } from "lucide-react"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { useRefreshPage } from "@/hooks/useRefreshPage"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function SendInvoiceAlertButton({
  bookingId,
  agencyId,
  assignedUserId,
  invoiceSentOn,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
  invoiceSentOn: Date | null
}) {
  const t = useTranslations("Dashboard.Buttons.SendInvoice")
  const router = useRouter()

  const [isPending, startSendTransition] = useTransition()

  //Can send invoice if either not sent before or sent more than X minutes ago
  const { canSend, refreshMinutes } = useRefreshPage(invoiceSentOn)

  // Send invoice to customer over whatsapp
  async function sendInvoice() {
    startSendTransition(async () => {
      const invoiceMessage = await sendInvoiceAction(
        bookingId,
        agencyId,
        assignedUserId,
      )
      if (invoiceMessage) {
        toast.success(t("Success"))
        window.open(invoiceMessage, "_blank", "noopener,noreferrer")
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
        onClick={sendInvoice}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

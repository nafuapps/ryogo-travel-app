"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./bookingAlertDialog"
import { Button } from "@/components/ui/button"
import { useEffect, useTransition } from "react"
import { sendInvoiceAction } from "@/app/actions/bookings/sendInvoiceAction"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { differenceInMinutes } from "date-fns"
import { MessageSquareShare } from "lucide-react"

const SEND_INVOICE_TIMEOUT_MINUTES = 60

type SendInvoiceAlertButtonProps = {
  bookingId: string
  agencyId: string
  assignedUserId: string
  invoiceSentOn: Date | null
}
export default function SendInvoiceAlertButton(
  props: SendInvoiceAlertButtonProps,
) {
  const t = useTranslations("Dashboard.Buttons.SendInvoice")
  const router = useRouter()

  const [isSendPending, startSendTransition] = useTransition()

  //Can send invoice if either not sent before or sent more than X minutes ago
  const canSendInvoice =
    !props.invoiceSentOn ||
    differenceInMinutes(new Date(), props.invoiceSentOn) >
      SEND_INVOICE_TIMEOUT_MINUTES

  //Refresh page every 10 minutes to check if the send invoice timer is up
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 600000)
    return () => clearInterval(interval) // Cleanup on unmount
  }, [router])

  // Send invoice to customer over whatsapp
  async function sendInvoice() {
    startSendTransition(async () => {
      const invoiceMessage = await sendInvoiceAction(
        props.bookingId,
        props.agencyId,
        props.assignedUserId,
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
        <Button variant={"outline"} disabled={!canSendInvoice}>
          {t("Label")}
          <MessageSquareShare className="size-4 text-slate-700" />
        </Button>
      }
    >
      <Button
        variant={"default"}
        onClick={sendInvoice}
        disabled={isSendPending}
      >
        {isSendPending && <Spinner />}
        {isSendPending ? t("Loading") : t("YesCTA")}
      </Button>
    </RyogoAlertDialog>
  )
}

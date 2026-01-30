"use client"

import { useTranslations } from "next-intl"
import BookingAlertDialog from "./bookingAlertDialog"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { sendInvoiceAction } from "@/app/actions/sendInvoiceAction"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

type SendInvoiceAlertButtonProps = {
  bookingId: string
}
export default function SendInvoiceAlertButton(
  props: SendInvoiceAlertButtonProps,
) {
  const t = useTranslations("Dashboard.Buttons.SendInvoice")

  const [isSendPending, startSendTransition] = useTransition()

  const [invoiceSent, setInvoiceSent] = useState(false)

  // Send invoice to customer over whatsapp
  async function sendInvoice() {
    startSendTransition(async () => {
      if (await sendInvoiceAction(props.bookingId)) {
        toast.success(t("Success"))
        setInvoiceSent(true)
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <BookingAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={
        <Button variant={"outline"} disabled={invoiceSent}>
          {invoiceSent ? t("InvoiceSent") : t("Label")}
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
    </BookingAlertDialog>
  )
}

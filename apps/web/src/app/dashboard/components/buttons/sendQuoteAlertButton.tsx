"use client"

import { useTranslations } from "next-intl"
import BookingAlertDialog from "./bookingAlertDialog"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { sendQuoteAction } from "@/app/actions/bookings/sendQuoteAction"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

type SendQuoteAlertButtonProps = {
  bookingId: string
}
export default function SendQuoteAlertButton(props: SendQuoteAlertButtonProps) {
  const t = useTranslations("Dashboard.Buttons.SendQuote")

  const [isSendPending, startSendTransition] = useTransition()

  const [quoteSent, setQuoteSent] = useState(false)

  // Send quote to customer over whatsapp
  async function sendQuote() {
    startSendTransition(async () => {
      if (await sendQuoteAction(props.bookingId)) {
        toast.success(t("Success"))
        setQuoteSent(true)
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
        <Button variant={"outline"} disabled={quoteSent}>
          {quoteSent ? t("QuoteSent") : t("Label")}
        </Button>
      }
    >
      <Button variant={"default"} onClick={sendQuote} disabled={isSendPending}>
        {isSendPending && <Spinner />}
        {isSendPending ? t("Loading") : t("YesCTA")}
      </Button>
    </BookingAlertDialog>
  )
}

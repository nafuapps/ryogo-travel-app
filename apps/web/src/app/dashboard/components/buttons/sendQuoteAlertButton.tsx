"use client"

import { useTranslations } from "next-intl"
import BookingAlertDialog from "./bookingAlertDialog"
import { Button } from "@/components/ui/button"
import { useEffect, useTransition } from "react"
import { sendQuoteAction } from "@/app/actions/bookings/sendQuoteAction"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { differenceInMinutes } from "date-fns"

type SendQuoteAlertButtonProps = {
  bookingId: string
  agencyId: string
  assignedUserId: string
  quoteSentOn: Date | null
}
export default function SendQuoteAlertButton(props: SendQuoteAlertButtonProps) {
  const t = useTranslations("Dashboard.Buttons.SendQuote")
  const router = useRouter()
  const [isSendPending, startSendTransition] = useTransition()

  //Can send quote if either not sent before or sent more than 10 minutes ago
  const canSendQuote =
    !props.quoteSentOn ||
    differenceInMinutes(new Date(), props.quoteSentOn) > 10

  //Refresh page every 1 minute to check if the send quote timer is up
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 60000)
    return () => clearInterval(interval) // Cleanup on unmount
  }, [router])

  // Send quote to customer over whatsapp
  async function sendQuote() {
    startSendTransition(async () => {
      if (
        await sendQuoteAction(
          props.bookingId,
          props.agencyId,
          props.assignedUserId,
          !props.quoteSentOn,
        )
      ) {
        toast.success(t("Success"))
        router.refresh()
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
        <Button variant={"outline"} disabled={!canSendQuote}>
          {t("Label")}
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

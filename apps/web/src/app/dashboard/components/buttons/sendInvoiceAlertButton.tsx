"use client"

import { useTranslations } from "next-intl"
import BookingAlertDialog from "./bookingAlertDialog"
import { Button } from "@/components/ui/button"
import { useEffect, useTransition } from "react"
import { sendInvoiceAction } from "@/app/actions/bookings/sendInvoiceAction"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { differenceInMinutes } from "date-fns"

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

  //Can send invoice if either not sent before or sent more than 10 minutes ago
  const canSendInvoice =
    !props.invoiceSentOn ||
    differenceInMinutes(new Date(), props.invoiceSentOn) > 10

  //Refresh page every 1 minute to check if the send invoice timer is up
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 60000)
    return () => clearInterval(interval) // Cleanup on unmount
  }, [router])

  // Send invoice to customer over whatsapp
  async function sendInvoice() {
    startSendTransition(async () => {
      if (
        await sendInvoiceAction(
          props.bookingId,
          props.agencyId,
          props.assignedUserId,
          !props.invoiceSentOn,
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
        <Button variant={"outline"} disabled={!canSendInvoice}>
          {t("Label")}
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

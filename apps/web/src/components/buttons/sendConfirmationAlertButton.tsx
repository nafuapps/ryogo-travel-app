"use client"

import { useTranslations } from "next-intl"
import BookingAlertDialog from "./bookingAlertDialog"
import { Button } from "@/components/ui/button"
import { useEffect, useTransition } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { differenceInMinutes } from "date-fns"
import { sendConfirmationAction } from "@/app/actions/bookings/sendConfirmationAction"
import { MessageSquareShare } from "lucide-react"

const SEND_CONFIRMATION_TIMEOUT_MINUTES = 60

type SendConfirmationAlertButtonProps = {
  bookingId: string
  agencyId: string
  assignedUserId: string
  confirmationSentOn: Date | null
}
export default function SendConfirmationAlertButton(
  props: SendConfirmationAlertButtonProps,
) {
  const t = useTranslations("Dashboard.Buttons.SendConfirmation")
  const router = useRouter()

  const [isSendPending, startSendTransition] = useTransition()

  //Can send confirmation if either not sent before or sent more than X minutes ago
  const canSendConfirmation =
    !props.confirmationSentOn ||
    differenceInMinutes(new Date(), props.confirmationSentOn) >
      SEND_CONFIRMATION_TIMEOUT_MINUTES

  //Refresh page every 10 minutes to check if the send confirmation timer is up
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 600000)
    return () => clearInterval(interval) // Cleanup on unmount
  }, [router])

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
    <BookingAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={
        <Button variant={"outline"} disabled={!canSendConfirmation}>
          {t("Label")}
          <MessageSquareShare className="size-4 text-slate-700" />
        </Button>
      }
    >
      <Button
        variant={"default"}
        onClick={sendConfirmation}
        disabled={isSendPending}
      >
        {isSendPending && <Spinner />}
        {isSendPending ? t("Loading") : t("YesCTA")}
      </Button>
    </BookingAlertDialog>
  )
}

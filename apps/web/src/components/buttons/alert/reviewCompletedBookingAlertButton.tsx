"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { ListCheck } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { reviewCompletedBookingAction } from "@/app/actions/bookings/reviewCompletedBookingAction"

export default function SendInvoiceAlertButton(props: {
  bookingId: string
  agencyId: string
  assignedUserId: string
}) {
  const t = useTranslations("Dashboard.Buttons.ReviewCompletedBooking")
  const router = useRouter()

  const [isSendPending, startSendTransition] = useTransition()

  // Mark booking as reviewed and generate invoice
  async function reviewAndGenerateInvoice() {
    startSendTransition(async () => {
      const reviewedBooking = await reviewCompletedBookingAction(
        props.bookingId,
        props.agencyId,
        props.assignedUserId,
      )
      if (reviewedBooking) {
        toast.success(t("Success"))
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
        <Button variant={"outline"}>
          <RyogoCaption color="light">{t("Label")}</RyogoCaption>
          <RyogoIcon icon={ListCheck} size="sm" />
        </Button>
      }
    >
      <Button
        variant={"default"}
        onClick={reviewAndGenerateInvoice}
        disabled={isSendPending}
      >
        {isSendPending && <Spinner />}
        <RyogoCaption color="white">
          {isSendPending ? t("Loading") : t("YesCTA")}
        </RyogoCaption>
      </Button>
    </RyogoAlertDialog>
  )
}

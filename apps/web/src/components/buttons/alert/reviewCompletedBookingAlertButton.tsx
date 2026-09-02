"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ListCheck } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { reviewCompletedBookingAction } from "@/app/actions/bookings/reviewCompletedBookingAction"
import {
  RyogoOutlineButton,
  RyogoDefaultButton,
} from "@/components/buttons/ryogoButtons"

export default function SendInvoiceAlertButton({
  bookingId,
  agencyId,
  assignedUserId,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
}) {
  const t = useTranslations("Dashboard.Buttons.ReviewCompletedBooking")
  const router = useRouter()

  const [isPending, startSendTransition] = useTransition()

  // Mark booking as reviewed and generate invoice
  async function reviewAndGenerateInvoice() {
    startSendTransition(async () => {
      const reviewedBooking = await reviewCompletedBookingAction(
        bookingId,
        agencyId,
        assignedUserId,
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
        <RyogoOutlineButton label={t("Label")}>
          <RyogoIcon icon={ListCheck} size="sm" />
        </RyogoOutlineButton>
      }
    >
      <RyogoDefaultButton
        onClick={reviewAndGenerateInvoice}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

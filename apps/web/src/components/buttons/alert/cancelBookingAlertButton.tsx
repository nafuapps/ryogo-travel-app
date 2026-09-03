"use client"

import { useTransition } from "react"
import { cancelBookingAction } from "@/app/actions/bookings/cancelBookingAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { CalendarOff } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function CancelBookingAlertButton({
  bookingId,
  agencyId,
  assignedUserId,
  isConfirmedBooking,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
  isConfirmedBooking?: boolean
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.CancelBooking")
  const router = useRouter()

  //Cancel booking
  async function cancel() {
    startCancelTransition(async () => {
      //If cancel is successful, show cancel success message and redirect to cancelled booking details
      const cancelMessage = await cancelBookingAction(
        bookingId,
        agencyId,
        assignedUserId,
        isConfirmedBooking,
      )
      if (cancelMessage) {
        toast.success(t("Success"))
        if (typeof cancelMessage === "string" && isConfirmedBooking) {
          //Confirmed booking being cancelled
          window.open(cancelMessage, "_blank", "noopener,noreferrer")
          router.refresh()
        } else {
          //Lead booking being cancelled
          router.replace(`/dashboard/bookings/${bookingId}`)
        }
      } else {
        //If cancel is not successful, show error message
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
          icon={CalendarOff}
          subtitle={t("Subtitle")}
        />
      }
    >
      <RyogoDefaultButton
        onClick={cancel}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

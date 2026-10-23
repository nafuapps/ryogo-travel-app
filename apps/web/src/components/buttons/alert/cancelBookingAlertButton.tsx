"use client"

import { cancelBookingAction } from "@/app/actions/bookings/cancelBookingAction"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { CalendarOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import RyogoAlertDialog from "./ryogoAlertDialog"

export default function CancelBookingAlertButton({
  bookingId,
  agencyId,
  assignedUserId,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.CancelBooking")
  const router = useRouter()

  //Cancel booking
  async function cancel() {
    startCancelTransition(async () => {
      //If cancel is successful, show cancel success message and redirect to cancelled booking details
      const cancelMessage = await cancelBookingAction({
        bookingId,
        agencyId,
        assignedUserId,
      })
      if (cancelMessage) {
        toast.success(t("Success"))
        if (typeof cancelMessage === "string") {
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

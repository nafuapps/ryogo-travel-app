"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ListRestart } from "lucide-react"
import { RyogoDestructiveButton } from "@/components/buttons/ryogoButtons"
import { reopenBookingAction } from "@/app/actions/bookings/reopenBookingAction"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function ReopenBookingAlertButton({
  bookingId,
  agencyId,
}: {
  bookingId: string
  agencyId: string
}) {
  const t = useTranslations("Dashboard.Buttons.ReopenBooking")
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  // Reopen booking and delete invoice
  async function reopenBooking() {
    startTransition(async () => {
      const reopenedBooking = await reopenBookingAction({ bookingId, agencyId })
      if (reopenedBooking) {
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
        <RyogoDetailedIconButton
          label={t("Label")}
          icon={ListRestart}
          subtitle={t("Subtitle")}
        />
      }
    >
      <RyogoDestructiveButton
        onClick={reopenBooking}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ChevronRight, Archive } from "lucide-react"
import { reconcileBookingAction } from "@/app/actions/bookings/reconcileBookingAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"

export default function ReconcileBookingAlertButton({
  bookingId,
  agencyId,
}: {
  bookingId: string
  agencyId: string
}) {
  const t = useTranslations("Dashboard.Buttons.ReconcileBooking")
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  async function reconcileBooking() {
    startTransition(async () => {
      const reconciledBooking = await reconcileBookingAction({
        bookingId,
        agencyId,
      })
      if (reconciledBooking) {
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
        <RyogoDefaultButton label={t("Label")}>
          <RyogoIcon icon={Archive} color="white" size={"xs"} thick />
        </RyogoDefaultButton>
      }
    >
      <SectionColWrapper className="lg:flex-row">
        <RyogoDefaultButton
          onClick={reconcileBooking}
          disabled={isPending}
          showSpinner={isPending}
          label={isPending ? t("Loading") : t("YesCTA")}
        />
        <RyogoOutlineButton
          label={t("Review")}
          onClick={() =>
            router.push(`/dashboard/bookings/${bookingId}/transactions`)
          }
        >
          <RyogoIcon icon={ChevronRight} color="slate" size={"xs"} />
        </RyogoOutlineButton>
      </SectionColWrapper>
    </RyogoAlertDialog>
  )
}

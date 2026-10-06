"use client"

import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ChevronRight, ListChecks } from "lucide-react"
import { closeBookingAction } from "@/app/actions/bookings/closeBookingAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"

export default function CloseBookingAlertButton({
  bookingId,
  agencyId,
  assignedUserId,
  customerEmail,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
  customerEmail: string | null
}) {
  const t = useTranslations("Dashboard.Buttons.CloseBooking")
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  // Close booking and generate invoice
  async function closeBooking() {
    startTransition(async () => {
      const closedBooking = await closeBookingAction({
        bookingId,
        agencyId,
        assignedUserId,
        customerEmail,
      })
      if (closedBooking) {
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
          <RyogoIcon icon={ListChecks} color="white" size={"sm"} />
        </RyogoDefaultButton>
      }
    >
      <SectionColWrapper className="lg:flex-row">
        <RyogoDefaultButton
          onClick={closeBooking}
          disabled={isPending}
          showSpinner={isPending}
          label={isPending ? t("Loading") : t("YesCTA")}
        />
        <RyogoOutlineButton
          label={t("Review")}
          onClick={() =>
            router.push(`/dashboard/bookings/${bookingId}/expenses`)
          }
        >
          <RyogoIcon icon={ChevronRight} color="slate" size={"xs"} />
        </RyogoOutlineButton>
      </SectionColWrapper>
    </RyogoAlertDialog>
  )
}

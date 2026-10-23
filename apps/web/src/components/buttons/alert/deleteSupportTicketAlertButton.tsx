"use client"

import { deleteSupportTicketAction } from "@/app/actions/support/deleteSupportTicketAction"
import {
  RyogoDestructiveButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import RyogoAlertDialog from "./ryogoAlertDialog"

export default function DeleteSupportTicketAlertButton({
  ticketId,
  userId,
  agencyId,
  isRider,
}: {
  ticketId: string
  userId: string
  agencyId: string
  isRider?: boolean
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteSupportTicket")

  const router = useRouter()

  async function deleteCustomMission() {
    startCancelTransition(async () => {
      if (await deleteSupportTicketAction({ ticketId, userId, agencyId })) {
        toast.success(t("Success"))
        router.replace(
          isRider ? `/rider/mySupport/tickets` : `/dashboard/support/tickets`,
        )
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
      labelChild={<RyogoGhostButton label={t("Label")} type="button" />}
    >
      <RyogoDestructiveButton
        onClick={deleteCustomMission}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}

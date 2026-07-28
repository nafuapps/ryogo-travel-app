"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { deleteSupportTicketAction } from "@/app/actions/support/deleteSupportTicketAction"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { RyogoCaption } from "@/components/typography"

export default function DeleteSupportTicketAlertButton({
  ticketId,
  userId,
  agencyId,
  status,
  isRider,
}: {
  ticketId: string
  userId: string
  agencyId: string
  status: TicketStatusEnum
  isRider?: boolean
}) {
  const [isCancelPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteSupportTicket")

  const router = useRouter()

  async function deleteCustomMission() {
    startCancelTransition(async () => {
      if (await deleteSupportTicketAction(ticketId, userId, agencyId, status)) {
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
      labelChild={
        <Button variant={"link"}>
          <RyogoCaption>{t("Label")}</RyogoCaption>
        </Button>
      }
    >
      <Button
        variant={"destructive"}
        onClick={deleteCustomMission}
        disabled={isCancelPending}
      >
        {isCancelPending && <Spinner />}
        {isCancelPending ? t("Loading") : t("YesCTA")}
      </Button>
    </RyogoAlertDialog>
  )
}

"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { takeDriverLeaveAction } from "@/app/actions/drivers/takeDriverLeaveAction"

export default function TakeDriverLeaveAlertButton({
  userId,
  driverId,
  leaveId,
  agencyId,
}: {
  userId: string
  driverId: string
  leaveId: string
  agencyId: string
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.TakeDriverLeave")

  const router = useRouter()

  //Take Driver Leave
  async function takeLeave() {
    startCancelTransition(async () => {
      if (await takeDriverLeaveAction(userId, driverId, leaveId, agencyId)) {
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
      labelChild={<RyogoDefaultButton label={t("Label")} type="button" />}
    >
      <RyogoDefaultButton
        onClick={takeLeave}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}

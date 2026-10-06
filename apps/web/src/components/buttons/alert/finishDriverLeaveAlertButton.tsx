"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { finishDriverLeaveAction } from "@/app/actions/drivers/finishDriverLeaveAction"

export default function FinishDriverLeaveAlertButton({
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
  const t = useTranslations("Dashboard.Buttons.FinishDriverLeave")

  const router = useRouter()

  //Finish Driver Leave
  async function finishLeave() {
    startCancelTransition(async () => {
      if (
        await finishDriverLeaveAction({ userId, driverId, leaveId, agencyId })
      ) {
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
        <RyogoOutlineButton
          label={t("Label")}
          type="button"
          className="w-full"
        />
      }
    >
      <RyogoDefaultButton
        onClick={finishLeave}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}

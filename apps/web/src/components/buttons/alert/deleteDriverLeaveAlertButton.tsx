"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import {
  RyogoGhostButton,
  RyogoDestructiveButton,
} from "@/components/buttons/ryogoButtons"
import { deleteDriverLeaveAction } from "@/app/actions/drivers/deleteDriverLeaveAction"

export default function DeleteDriverLeaveAlertButton({
  leaveId,
  userId,
  agencyId,
  disabled,
}: {
  leaveId: string
  userId: string
  agencyId: string
  disabled: boolean
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteDriverLeave")

  const router = useRouter()

  async function deleteLeave() {
    startCancelTransition(async () => {
      const leave = await await deleteDriverLeaveAction({
        leaveId,
        userId,
        agencyId,
      })
      if (leave) {
        toast.success(t("Success"))
        router.replace(`/dashboard/drivers/${leave.driverId}/leaves`)
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
        <RyogoGhostButton
          label={t("Label")}
          labelColor="light"
          type="button"
          disabled={disabled}
        />
      }
    >
      <RyogoDestructiveButton
        onClick={deleteLeave}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}

"use client"

import { deleteReminderAction } from "@/app/actions/missions/deleteReminderAction"
import {
  RyogoDestructiveButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import RyogoAlertDialog from "./ryogoAlertDialog"

export default function DeleteReminderAlertButton({
  missionId,
  assignedUserId,
  agencyId,
  disabled,
  isRider,
}: {
  missionId: string
  assignedUserId: string
  agencyId: string
  disabled: boolean
  isRider?: boolean
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteReminder")

  const router = useRouter()

  async function deleteReminder() {
    startCancelTransition(async () => {
      if (await deleteReminderAction({ missionId, assignedUserId, agencyId })) {
        toast.success(t("Success"))
        router.replace(isRider ? `/rider/myMissions` : `/dashboard/missions`)
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
        onClick={deleteReminder}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}

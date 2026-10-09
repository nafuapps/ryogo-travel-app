"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { deleteReminderAction } from "@/app/actions/missions/deleteReminderAction"
import {
  RyogoGhostButton,
  RyogoDestructiveButton,
} from "@/components/buttons/ryogoButtons"

export default function DeleteReminderAlertButton({
  missionId,
  userId,
  agencyId,
  disabled,
  isRider,
}: {
  missionId: string
  userId: string
  agencyId: string
  disabled: boolean
  isRider?: boolean
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteReminder")

  const router = useRouter()

  async function deleteReminder() {
    startCancelTransition(async () => {
      if (await deleteReminderAction({ missionId, userId, agencyId })) {
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

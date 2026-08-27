"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { deleteMissionAction } from "@/app/actions/missions/deleteMissionAction"
import {
  RyogoGhostButton,
  RyogoDestructiveButton,
} from "@/components/buttons/ryogoButtons"

export default function DeleteMissionAlertButton(props: {
  missionId: string
  userId: string
  agencyId: string
  isRider?: boolean
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteMission")

  const router = useRouter()

  async function deleteMission() {
    startCancelTransition(async () => {
      if (
        await deleteMissionAction(props.missionId, props.userId, props.agencyId)
      ) {
        toast.success(t("Success"))
        router.replace(
          props.isRider ? `/rider/myMissions` : `/dashboard/mission-control`,
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
      labelChild={<RyogoGhostButton label={t("Label")} labelColor="light" />}
    >
      <RyogoDestructiveButton
        onClick={deleteMission}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

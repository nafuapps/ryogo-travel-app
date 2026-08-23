"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { deleteMissionAction } from "@/app/actions/missions/deleteMissionAction"
import { RyogoCaption } from "@/components/typography"

export default function DeleteMissionAlertButton(props: {
  missionId: string
  userId: string
  agencyId: string
  isRider?: boolean
}) {
  const [isCancelPending, startCancelTransition] = useTransition()
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
      labelChild={
        <Button variant={"ghost"}>
          <RyogoCaption color="light">{t("Label")}</RyogoCaption>
        </Button>
      }
    >
      <Button
        variant={"destructive"}
        onClick={deleteMission}
        disabled={isCancelPending}
      >
        {isCancelPending && <Spinner />}
        <RyogoCaption color="white">
          {isCancelPending ? t("Loading") : t("YesCTA")}
        </RyogoCaption>
      </Button>
    </RyogoAlertDialog>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { deleteCustomMissionAction } from "@/app/actions/missions/deleteCustomMissionAction"

export default function DeleteCustomMissionAlertButton({
  missionId,
  userId,
  agencyId,
}: {
  missionId: string
  userId: string
  agencyId: string
}) {
  const [isCancelPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteCustomMission")

  const router = useRouter()

  async function deleteCustomMission() {
    startCancelTransition(async () => {
      if (await deleteCustomMissionAction(missionId, userId, agencyId)) {
        toast.success(t("Success"))
        router.replace(`/dashboard/mission-control`)
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
      labelChild={<Button variant={"secondary"}>{t("Label")}</Button>}
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

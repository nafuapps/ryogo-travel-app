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
import { startVehicleRepairAction } from "@/app/actions/vehicles/startVehicleRepairAction"

export default function StartVehicleRepairAlertButton({
  userId,
  vehicleId,
  repairId,
  agencyId,
}: {
  userId: string
  vehicleId: string
  repairId: string
  agencyId: string
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.StartVehicleRepair")

  const router = useRouter()

  //Start Vehicle Repair
  async function startRepair() {
    startCancelTransition(async () => {
      if (
        await startVehicleRepairAction(userId, vehicleId, repairId, agencyId)
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
        <RyogoOutlineButton label={t("Label")} type="button" className="grow" />
      }
    >
      <RyogoDefaultButton
        onClick={startRepair}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}

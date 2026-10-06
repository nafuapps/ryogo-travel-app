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
import { finishVehicleRepairAction } from "@/app/actions/vehicles/finishVehicleRepairAction"

export default function FinishVehicleRepairAlertButton({
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
  const [isPending, finishCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.FinishVehicleRepair")

  const router = useRouter()

  //Finish Vehicle Repair
  async function finishRepair() {
    finishCancelTransition(async () => {
      if (
        await finishVehicleRepairAction({
          userId,
          vehicleId,
          repairId,
          agencyId,
        })
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
        onClick={finishRepair}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}

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
import { deleteVehicleRepairAction } from "@/app/actions/vehicles/deleteVehicleRepairAction"

export default function DeleteVehicleRepairAlertButton({
  repairId,
  userId,
  agencyId,
  disabled,
}: {
  repairId: string
  userId: string
  agencyId: string
  disabled: boolean
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteVehicleRepair")

  const router = useRouter()

  async function deleteRepair() {
    startCancelTransition(async () => {
      const repair = await await deleteVehicleRepairAction({
        repairId,
        userId,
        agencyId,
      })
      if (repair) {
        toast.success(t("Success"))
        router.replace(`/dashboard/vehicles/${repair.vehicleId}/repairs`)
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
        onClick={deleteRepair}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}

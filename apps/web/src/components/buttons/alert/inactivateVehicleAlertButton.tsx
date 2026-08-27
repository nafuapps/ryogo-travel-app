"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { inactivateVehicleAction } from "@/app/actions/vehicles/inactivateVehicleAction"
import {
  RyogoGhostButton,
  RyogoDestructiveButton,
} from "@/components/buttons/ryogoButtons"

export default function InactivateVehicleAlertButton(props: {
  vehicleId: string
  agencyId: string
}) {
  const t = useTranslations("Dashboard.Buttons.InactivateVehicle")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function inactivate() {
    startTransition(async () => {
      if (await inactivateVehicleAction(props.vehicleId, props.agencyId)) {
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
      labelChild={<RyogoGhostButton label={t("Label")} />}
    >
      <RyogoDestructiveButton
        onClick={inactivate}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

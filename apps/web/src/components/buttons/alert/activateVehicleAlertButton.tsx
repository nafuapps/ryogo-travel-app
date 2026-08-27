"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { activateVehicleAction } from "@/app/actions/vehicles/activateVehicleAction"
import {
  RyogoOutlineButton,
  RyogoDefaultButton,
} from "@/components/buttons/ryogoButtons"

export default function ActivateVehicleAlertButton(props: {
  vehicleId: string
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.ActivateVehicle")
  const router = useRouter()

  async function activate() {
    startTransition(async () => {
      if (await activateVehicleAction(props.vehicleId, props.agencyId)) {
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
      labelChild={<RyogoOutlineButton label={t("Label")} />}
    >
      <RyogoDefaultButton
        onClick={activate}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

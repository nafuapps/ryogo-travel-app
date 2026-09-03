"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { inactivateVehicleAction } from "@/app/actions/vehicles/inactivateVehicleAction"
import { RyogoDestructiveButton } from "@/components/buttons/ryogoButtons"
import { ZapOff } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function InactivateVehicleAlertButton({
  vehicleId,
  agencyId,
}: {
  vehicleId: string
  agencyId: string
}) {
  const t = useTranslations("Dashboard.Buttons.InactivateVehicle")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function inactivate() {
    startTransition(async () => {
      if (await inactivateVehicleAction(vehicleId, agencyId)) {
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
        <RyogoDetailedIconButton
          label={t("Label")}
          icon={ZapOff}
          subtitle={t("Subtitle")}
        />
      }
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

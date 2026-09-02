"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { inactivateDriverAction } from "@/app/actions/drivers/inactivateDriverAction"
import {
  RyogoDestructiveButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"

export default function InactivateDriverAlertButton({
  driverId,
  agencyId,
}: {
  driverId: string
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.InactivateDriver")
  const router = useRouter()

  async function inactivate() {
    startTransition(async () => {
      if (await inactivateDriverAction(driverId, agencyId)) {
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

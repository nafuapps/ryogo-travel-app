"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { activateDriverAction } from "@/app/actions/drivers/activateDriverAction"
import {
  RyogoOutlineButton,
  RyogoDefaultButton,
} from "@/components/buttons/ryogoButtons"

export default function ActivateDriverAlertButton(props: {
  driverId: string
  userId: string
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.ActivateDriver")
  const router = useRouter()

  async function activate() {
    startTransition(async () => {
      if (
        await activateDriverAction(props.driverId, props.userId, props.agencyId)
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

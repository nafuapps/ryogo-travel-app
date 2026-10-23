"use client"

import { tryPremiumAction } from "@/app/actions/agencies/tryPremiumAction"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import RyogoAlertDialog from "./ryogoAlertDialog"

export default function TryPremiumAlertButton({
  agencyId,
  days,
  displayButton,
}: {
  agencyId: string
  days: number
  displayButton: React.ReactNode
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.TryPremium")
  const router = useRouter()

  async function tryPremium() {
    startTransition(async () => {
      if (await tryPremiumAction({ agencyId, days })) {
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
      desc={t("Desc", { trialDays: PREMIUM_TRIAL_DAYS })}
      noCTA={t("NoCTA")}
      labelChild={displayButton}
    >
      <RyogoDefaultButton
        onClick={tryPremium}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

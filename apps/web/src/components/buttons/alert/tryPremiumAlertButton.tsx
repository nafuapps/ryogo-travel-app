"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { tryPremiumAction } from "@/app/actions/agencies/tryPremiumAction"

export default function TryPremiumAlertButton({
  agencyId,
}: {
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.TryPremium")
  const router = useRouter()

  async function activate() {
    startTransition(async () => {
      if (await tryPremiumAction(agencyId)) {
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
      labelChild={<Button variant={"outline"}>{t("Label")}</Button>}
    >
      <Button variant={"default"} onClick={activate} disabled={isPending}>
        {isPending && <Spinner />}
        {isPending ? t("Loading") : t("YesCTA")}
      </Button>
    </RyogoAlertDialog>
  )
}

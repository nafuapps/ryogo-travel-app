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
import { RyogoCaption } from "@/components/typography"

export default function TryPremiumAlertButton({
  agencyId,
  userId,
  displayButton,
}: {
  agencyId: string
  userId: string
  displayButton: React.ReactNode
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.TryPremium")
  const router = useRouter()

  async function activate() {
    startTransition(async () => {
      if (await tryPremiumAction(agencyId, userId)) {
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
      <Button variant={"default"} onClick={activate} disabled={isPending}>
        {isPending && <Spinner />}
        <RyogoCaption color="white">
          {isPending ? t("Loading") : t("YesCTA")}
        </RyogoCaption>
      </Button>
    </RyogoAlertDialog>
  )
}

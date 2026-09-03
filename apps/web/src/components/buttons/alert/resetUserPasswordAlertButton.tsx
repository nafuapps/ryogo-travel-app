"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { resetUserPasswordAction } from "@/app/actions/users/resetUserPasswordAction"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { KeyRound } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function ResetUserPasswordAlertButton({
  userId,
  agencyId,
}: {
  userId: string
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.ResetUserPassword")
  const router = useRouter()

  const reset = async () => {
    startTransition(async () => {
      if (await resetUserPasswordAction(userId, agencyId)) {
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
          icon={KeyRound}
          subtitle={t("Subtitle")}
        />
      }
    >
      <RyogoDefaultButton
        onClick={reset}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

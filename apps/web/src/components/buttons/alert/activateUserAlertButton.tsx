"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { activateUserAction } from "@/app/actions/users/activateUserAction"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { Zap } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function ActivateUserAlertButton({
  userId,
  agencyId,
  role,
}: {
  userId: string
  agencyId: string
  role: UserRolesEnum
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.ActivateUser")
  const router = useRouter()

  async function activate() {
    startTransition(async () => {
      if (await activateUserAction(userId, agencyId, role)) {
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
          icon={Zap}
          subtitle={t("Subtitle")}
        />
      }
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

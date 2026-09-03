"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { transferAdminAction } from "@/app/actions/users/transferAdminAction"
import { RyogoDestructiveButton } from "@/components/buttons/ryogoButtons"
import { UserStar } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function TransferAdminAlertButton({
  currentUserId,
  otherUserId,
  agencyId,
}: {
  currentUserId: string
  otherUserId: string
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.TransferAdmin")
  const router = useRouter()

  async function transferAdmin() {
    startTransition(async () => {
      if (await transferAdminAction(currentUserId, otherUserId, agencyId)) {
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
          icon={UserStar}
          subtitle={t("Subtitle")}
        />
      }
    >
      <RyogoDestructiveButton
        onClick={transferAdmin}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

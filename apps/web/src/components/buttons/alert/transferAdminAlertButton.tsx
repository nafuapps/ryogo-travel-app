"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { transferAdminAction } from "@/app/actions/users/transferAdminAction"
import { RyogoCaption } from "@/components/typography"

export default function TransferAdminAlertButton(props: {
  currentUserId: string
  otherUserId: string
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.TransferAdmin")
  const router = useRouter()

  async function transferAdmin() {
    startTransition(async () => {
      if (
        await transferAdminAction(
          props.currentUserId,
          props.otherUserId,
          props.agencyId,
        )
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
      labelChild={
        <Button variant={"ghost"}>
          <RyogoCaption color="light">{t("Label")}</RyogoCaption>
        </Button>
      }
    >
      <Button
        variant={"destructive"}
        onClick={transferAdmin}
        disabled={isPending}
      >
        {isPending && <Spinner />}
        <RyogoCaption color="white">
          {isPending ? t("Loading") : t("YesCTA")}
        </RyogoCaption>
      </Button>
    </RyogoAlertDialog>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { inactivateUserAction } from "@/app/actions/users/inactivateUserAction"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { RyogoCaption } from "@/components/typography"

export default function InactivateUserAlertButton(props: {
  userId: string
  agencyId: string
  role: UserRolesEnum
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.InactivateUser")
  const router = useRouter()

  async function inactivate() {
    startTransition(async () => {
      if (
        await inactivateUserAction(props.userId, props.agencyId, props.role)
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
      <Button variant={"destructive"} onClick={inactivate} disabled={isPending}>
        {isPending && <Spinner />}
        <RyogoCaption color="white">
          {isPending ? t("Loading") : t("YesCTA")}
        </RyogoCaption>
      </Button>
    </RyogoAlertDialog>
  )
}

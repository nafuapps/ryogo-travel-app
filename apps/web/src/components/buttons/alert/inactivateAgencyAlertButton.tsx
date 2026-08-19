"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { RyogoCaption } from "@/components/typography"
import { inactivateAgencyAction } from "@/app/actions/agencies/inactivateAgencyAction"

export default function InactivateAgencyAlertButton(props: {
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.InactivateAgency")
  const router = useRouter()

  async function inactivate() {
    startTransition(async () => {
      if (await inactivateAgencyAction(props.agencyId)) {
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

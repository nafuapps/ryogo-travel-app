"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { activateAgencyAction } from "@/app/actions/agencies/activateAgencyAction"
import { RyogoCaption } from "@/components/typography"

export default function ActivateAgencyAlertButton(props: { agencyId: string }) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.ActivateAgency")
  const router = useRouter()

  async function activate() {
    startTransition(async () => {
      if (await activateAgencyAction(props.agencyId)) {
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
        <Button variant={"outline"}>
          <RyogoCaption color="light">{t("Label")}</RyogoCaption>
        </Button>
      }
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

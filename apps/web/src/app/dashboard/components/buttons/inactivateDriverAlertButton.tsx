"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import BookingAlertDialog from "./bookingAlertDialog"
import { inactivateDriverAction } from "@/app/actions/drivers/inactivateDriverAction"

type InactivateDriverAlertButtonProps = {
  driverId: string
  agencyId: string
}
export default function InactivateDriverAlertButton(
  props: InactivateDriverAlertButtonProps,
) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.InactivateDriver")
  const router = useRouter()

  async function inactivate() {
    startTransition(async () => {
      if (await inactivateDriverAction(props.driverId, props.agencyId)) {
        toast.success(t("Success"))
        router.refresh()
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <BookingAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={<Button variant={"secondary"}>{t("Label")}</Button>}
    >
      <Button variant={"destructive"} onClick={inactivate} disabled={isPending}>
        {isPending && <Spinner />}
        {isPending ? t("Loading") : t("YesCTA")}
      </Button>
    </BookingAlertDialog>
  )
}

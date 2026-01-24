"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import BookingAlertDialog from "./bookingAlertDialog"
import { inactivateUserAction } from "../actions/inactivateUserAction"

type InactivateUserAlertButtonProps = {
  userId: string
}
export default function InactivateUserAlertButton(
  props: InactivateUserAlertButtonProps,
) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.InactivateUser")
  const router = useRouter()

  async function inactivate() {
    startTransition(async () => {
      if (await inactivateUserAction(props.userId)) {
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

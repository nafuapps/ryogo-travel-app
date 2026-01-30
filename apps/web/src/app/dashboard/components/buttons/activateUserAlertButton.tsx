"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import BookingAlertDialog from "./bookingAlertDialog"
import { activateUserAction } from "@/app/actions/activateUserAction"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

type ActivateUserAlertButtonProps = {
  userId: string
  role: UserRolesEnum
}
export default function ActivateUserAlertButton(
  props: ActivateUserAlertButtonProps,
) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.ActivateUser")
  const router = useRouter()

  async function activate() {
    startTransition(async () => {
      if (await activateUserAction(props.userId, props.role)) {
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
      labelChild={<Button variant={"outline"}>{t("Label")}</Button>}
    >
      <Button variant={"default"} onClick={activate} disabled={isPending}>
        {isPending && <Spinner />}
        {isPending ? t("Loading") : t("YesCTA")}
      </Button>
    </BookingAlertDialog>
  )
}

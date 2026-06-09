"use client"

import { Button } from "@/components/ui/button"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { logoutAction } from "@/app/actions/users/logoutAction"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import { Spinner } from "@/components/ui/spinner"

export default function LogoutAlertButton() {
  const t = useTranslations("Dashboard.Buttons.Logout")
  const [isPending, startTransition] = useTransition()

  async function logout() {
    startTransition(async () => {
      await logoutAction()
    })
  }
  return (
    <RyogoAlertDialog
      title={t("Title")}
      desc={""}
      noCTA={t("NoCTA")}
      labelChild={
        <Button variant={"secondary"} className="hover:bg-red-200">
          {t("Label")}
        </Button>
      }
    >
      <Button variant="destructive" onClick={logout} disabled={isPending}>
        {isPending && <Spinner />}
        {t("YesCTA")}
      </Button>
    </RyogoAlertDialog>
  )
}

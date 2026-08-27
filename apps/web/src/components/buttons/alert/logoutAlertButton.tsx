"use client"

import RyogoAlertDialog from "./ryogoAlertDialog"
import { logoutAction } from "@/app/actions/users/logoutAction"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import {
  RyogoGhostButton,
  RyogoDestructiveButton,
} from "@/components/buttons/ryogoButtons"

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
      noCTA={t("NoCTA")}
      labelChild={<RyogoGhostButton label={t("Label")} />}
    >
      <RyogoDestructiveButton
        onClick={logout}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}

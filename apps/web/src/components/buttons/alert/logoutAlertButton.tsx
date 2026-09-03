"use client"

import RyogoAlertDialog from "./ryogoAlertDialog"
import { logoutAction } from "@/app/actions/users/logoutAction"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import { RyogoDestructiveButton } from "@/components/buttons/ryogoButtons"
import { LogOut } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

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
      labelChild={
        <RyogoDetailedIconButton
          label={t("Label")}
          icon={LogOut}
          subtitle={t("Subtitle")}
        />
      }
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

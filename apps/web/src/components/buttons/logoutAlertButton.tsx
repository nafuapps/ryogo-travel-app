import { Button } from "@/components/ui/button"
import RyogoAlertDialog from "./bookingAlertDialog"
import { logoutAction } from "@/app/actions/users/logoutAction"
import { getTranslations } from "next-intl/server"

export default async function LogoutAlertButton() {
  const t = await getTranslations("Dashboard.Buttons.Logout")

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
      <form action={logoutAction}>
        <Button variant={"default"} className="w-full">
          {t("YesCTA")}
        </Button>
      </form>
    </RyogoAlertDialog>
  )
}

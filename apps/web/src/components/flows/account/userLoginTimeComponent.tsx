import { RyogoTiny } from "@/components/typography"
import moment from "moment"
import { getTranslations } from "next-intl/server"

export default async function UserLoginTimeComponent({
  sessionLoginAt,
}: {
  sessionLoginAt: Date
}) {
  const t = await getTranslations("Dashboard.Account")
  return (
    <RyogoTiny color="light" className="text-center">
      {t("LastLogin", {
        loginTime: moment(sessionLoginAt).format("MMMM Do YYYY, h:mm:ss a"),
      })}
    </RyogoTiny>
  )
}

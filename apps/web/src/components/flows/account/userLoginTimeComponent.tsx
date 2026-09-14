import { RyogoCaption } from "@/components/typography"
import moment from "moment"
import { getTranslations } from "next-intl/server"

export default async function UserLoginTimeComponent({
  lastLoginTime,
}: {
  lastLoginTime: Date
}) {
  const t = await getTranslations("Dashboard.Account")
  return (
    <RyogoCaption color="light" className="text-center">
      {t("LastLogin", {
        loginTime: moment(lastLoginTime).format("MMMM Do YYYY, h:mm:ss a"),
      })}
    </RyogoCaption>
  )
}

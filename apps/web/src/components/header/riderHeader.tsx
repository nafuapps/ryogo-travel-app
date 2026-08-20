import Link from "next/link"
import HeaderButton from "./headerButton"
import RyogoHeader from "./ryogoHeader"
import { getTranslations } from "next-intl/server"

export default async function RiderHeader({ pathName }: { pathName: string }) {
  const t = await getTranslations("Rider.Header")

  const titleKey = ("Title." + pathName || "Title./rider") as Parameters<
    typeof t
  >[0]
  const title = t(titleKey)

  return (
    <RyogoHeader title={title}>
      <Link href="/rider/myMissions">
        <HeaderButton label={t("MissionControl")} type="missionControl" />
      </Link>
    </RyogoHeader>
  )
}

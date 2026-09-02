import HeaderButton from "./headerButton"
import Link from "next/link"
import RyogoHeader from "./ryogoHeader"
import { getTranslations } from "next-intl/server"

export default async function DashboardHeader({
  pathName,
}: {
  pathName: string
}) {
  const t = await getTranslations("Dashboard.Header")

  const titleKey = ("Title." + pathName || "Title./dashboard") as Parameters<
    typeof t
  >[0]
  const title = t(titleKey)

  return (
    <RyogoHeader title={title}>
      {pathName !== "/dashboard/bookings/new" && (
        <Link href="/dashboard/bookings/new">
          <HeaderButton label={t("NewBooking")} type="newBooking" />
        </Link>
      )}
      {pathName !== "/dashboard/missions" && (
        <Link href="/dashboard/missions">
          <HeaderButton label={t("Missions")} type="missions" />
        </Link>
      )}
    </RyogoHeader>
  )
}

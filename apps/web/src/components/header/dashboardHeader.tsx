import { getTranslations } from "next-intl/server"
import Link from "next/link"
import HeaderButton from "./headerButton"
import RyogoHeader from "./ryogoHeader"

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
        <Link href="/dashboard/bookings/new" prefetch={false}>
          <HeaderButton label={t("NewBooking")} type="newBooking" />
        </Link>
      )}
    </RyogoHeader>
  )
}

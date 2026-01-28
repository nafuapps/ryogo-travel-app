import { Small } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type BookingDetailHeaderTab =
  | "Details"
  | "Transactions"
  | "TripLogs"
  | "Expenses"

type BookingDetailHeaderTabsProps = {
  selectedTab: BookingDetailHeaderTab
  id: string
}
export default async function BookingDetailHeaderTabs(
  props: BookingDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.BookingDetailsHeaderTabs")
  const links = {
    Details: `/dashboard/bookings/${props.id}`,
    Transactions: `/dashboard/bookings/${props.id}/transactions`,
    TripLogs: `/dashboard/bookings/${props.id}/trip-logs`,
    Expenses: `/dashboard/bookings/${props.id}/expenses`,
  } as const

  return (
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {(Object.keys(links) as BookingDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <div
            className={`flex items-center rounded justify-center px-2 py-1 lg:px-3 lg:py-1.5 ${
              props.selectedTab == tab ? "bg-white shadow" : ""
            }`}
          >
            <Small>{t(tab)}</Small>
          </div>
        </Link>
      ))}
    </div>
  )
}

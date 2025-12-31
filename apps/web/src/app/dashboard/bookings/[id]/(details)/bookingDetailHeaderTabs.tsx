import { Small } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { UrlObject } from "url"

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
  props: BookingDetailHeaderTabsProps
) {
  const t = await getTranslations("Dashboard.BookingDetailsHeaderTabs")
  const detailLink = `/dashboard/bookings/${props.id}` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const transactionsLink = `/dashboard/bookings/${props.id}/transactions` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const tripLogsLink = `/dashboard/bookings/${props.id}/trip-logs` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const expensesLink = `/dashboard/bookings/${props.id}/expenses` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const links = {
    Details: detailLink,
    Transactions: transactionsLink,
    TripLogs: tripLogsLink,
    Expenses: expensesLink,
  }

  return (
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {(
        [
          "Details",
          "Transactions",
          "TripLogs",
          "Expenses",
        ] as BookingDetailHeaderTab[]
      ).map((tab) => (
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

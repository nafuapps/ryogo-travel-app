import { Small } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { UrlObject } from "url"

type CustomerDetailHeaderTab = "Details" | "Upcoming" | "Completed"

type CustomerDetailHeaderTabsProps = {
  selectedTab: CustomerDetailHeaderTab
  id: string
}
export default async function CustomerDetailHeaderTabs(
  props: CustomerDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.CustomerDetailsHeaderTabs")
  const detailLink = `/dashboard/customers/${props.id}` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const upcomingLink = `/dashboard/customers/${props.id}/upcoming` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const completedLink = `/dashboard/customers/${props.id}/completed` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>

  const links = {
    Details: detailLink,
    Upcoming: upcomingLink,
    Completed: completedLink,
  }

  return (
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {(["Details", "Upcoming", "Completed"] as CustomerDetailHeaderTab[]).map(
        (tab) => (
          <Link href={links[tab]} key={tab}>
            <div
              className={`flex items-center rounded justify-center px-2 py-1 lg:px-3 lg:py-1.5 ${
                props.selectedTab == tab ? "bg-white shadow" : ""
              }`}
            >
              <Small>{t(tab)}</Small>
            </div>
          </Link>
        ),
      )}
    </div>
  )
}

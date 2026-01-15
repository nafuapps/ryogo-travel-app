import { Small } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { UrlObject } from "url"

type DriverDetailHeaderTab = "Details" | "Assigned" | "Completed" | "Leaves"

type DriverDetailHeaderTabsProps = {
  selectedTab: DriverDetailHeaderTab
  id: string
}
export default async function DriverDetailHeaderTabs(
  props: DriverDetailHeaderTabsProps
) {
  const t = await getTranslations("Dashboard.DriverDetailsHeaderTabs")
  const detailLink = `/dashboard/drivers/${props.id}` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const assignedLink = `/dashboard/drivers/${props.id}/assigned` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const completedLink = `/dashboard/drivers/${props.id}/completed` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const leavesLink = `/dashboard/drivers/${props.id}/leaves` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>

  const links = {
    Details: detailLink,
    Assigned: assignedLink,
    Completed: completedLink,
    Leaves: leavesLink,
  }

  return (
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {(
        [
          "Details",
          "Assigned",
          "Completed",
          "Leaves",
        ] as DriverDetailHeaderTab[]
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

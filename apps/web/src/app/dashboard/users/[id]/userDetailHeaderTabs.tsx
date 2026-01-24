import { Small } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { UrlObject } from "url"

type UserDetailHeaderTab = "Details" | "Assigned" | "Activity"

type UserDetailHeaderTabsProps = {
  selectedTab: UserDetailHeaderTab
  id: string
}
export default async function UserDetailHeaderTabs(
  props: UserDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.UserDetailsHeaderTabs")
  const detailLink = `/dashboard/users/${props.id}` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const assignedLink = `/dashboard/users/${props.id}/assigned` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const activityLink = `/dashboard/users/${props.id}/activity` as
    | UrlObject
    | __next_route_internal_types__.RouteImpl<URL>
  const links = {
    Details: detailLink,
    Assigned: assignedLink,
    Activity: activityLink,
  }

  return (
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {(["Details", "Assigned", "Activity"] as UserDetailHeaderTab[]).map(
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

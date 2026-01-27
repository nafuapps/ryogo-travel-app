import { Small } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type UserDetailHeaderTab = "Details" | "Assigned" | "Completed" | "Activity"

type UserDetailHeaderTabsProps = {
  selectedTab: UserDetailHeaderTab
  id: string
}
export default async function UserDetailHeaderTabs(
  props: UserDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.UserDetailsHeaderTabs")

  const links = {
    Details: `/dashboard/users/${props.id}`,
    Assigned: `/dashboard/users/${props.id}/assigned`,
    Completed: `/dashboard/users/${props.id}/completed`,
    Activity: `/dashboard/users/${props.id}/activity`,
  }

  return (
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {(Object.keys(links) as UserDetailHeaderTab[]).map((tab) => (
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

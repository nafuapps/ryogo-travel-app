import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type UserDetailHeaderTab = "User" | "Assigned" | "Completed" | "Activity"

type UserDetailHeaderTabsProps = {
  selectedTab: UserDetailHeaderTab
  id: string
}
export default async function UserDetailHeaderTabs(
  props: UserDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.UserDetailsHeaderTabs")

  const links = {
    User: `/dashboard/users/${props.id}`,
    Assigned: `/dashboard/users/${props.id}/assigned`,
    Completed: `/dashboard/users/${props.id}/completed`,
    Activity: `/dashboard/users/${props.id}/activity`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <RyogoH2 color="brand">{props.id}</RyogoH2>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as UserDetailHeaderTab[]).map((tab) => (
          <Link href={links[tab]} key={tab}>
            <DetailsHeaderTabItem
              label={t(tab)}
              selected={props.selectedTab === tab}
            />
          </Link>
        ))}
      </DetailsHeaderTabWrapper>
    </div>
  )
}

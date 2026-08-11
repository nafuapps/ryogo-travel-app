import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type UserDetailHeaderTab = "User" | "Assigned" | "Completed" | "Activity"

export default async function UserDetailHeaderTabs({
  id,
  selectedTab,
}: {
  id: string
  selectedTab: UserDetailHeaderTab
}) {
  const t = await getTranslations("Dashboard.UserDetailsHeaderTabs")

  const links = {
    User: `/dashboard/users/${id}`,
    Assigned: `/dashboard/users/${id}/assigned`,
    Completed: `/dashboard/users/${id}/completed`,
    Activity: `/dashboard/users/${id}/activity`,
  } as const

  return (
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as UserDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <DetailsHeaderTabItem label={t(tab)} selected={selectedTab === tab} />
        </Link>
      ))}
    </DetailsHeaderTabWrapper>
  )
}

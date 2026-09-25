import { getTranslations } from "next-intl/server"
import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"

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
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}

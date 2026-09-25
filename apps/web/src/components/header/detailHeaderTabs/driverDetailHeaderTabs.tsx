import { getTranslations } from "next-intl/server"
import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"

type DriverDetailHeaderTab = "Driver" | "Assigned" | "Completed" | "Leaves"

export default async function DriverDetailHeaderTabs({
  id,
  selectedTab,
}: {
  id: string
  selectedTab: DriverDetailHeaderTab
}) {
  const t = await getTranslations("Dashboard.DriverDetailsHeaderTabs")

  const links = {
    Driver: `/dashboard/drivers/${id}`,
    Assigned: `/dashboard/drivers/${id}/assigned`,
    Completed: `/dashboard/drivers/${id}/completed`,
    Leaves: `/dashboard/drivers/${id}/leaves`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}

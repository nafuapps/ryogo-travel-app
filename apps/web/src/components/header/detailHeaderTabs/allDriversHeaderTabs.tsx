import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"
import { getTranslations } from "next-intl/server"

type AllDriversHeaderTab = "Home" | "Schedule"

export default async function AllDriversHeaderTabs({
  selectedTab,
}: {
  selectedTab: AllDriversHeaderTab
}) {
  const t = await getTranslations("Dashboard.AllDriversHeaderTabs")
  const links = {
    Home: `/dashboard/drivers`,
    Schedule: `/dashboard/drivers/schedule`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}

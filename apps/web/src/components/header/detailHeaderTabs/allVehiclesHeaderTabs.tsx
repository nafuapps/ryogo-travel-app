import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"
import { getTranslations } from "next-intl/server"

type AllVehiclesHeaderTab = "Home" | "Schedule"

export default async function AllVehiclesHeaderTabs({
  selectedTab,
}: {
  selectedTab: AllVehiclesHeaderTab
}) {
  const t = await getTranslations("Dashboard.AllVehiclesHeaderTabs")
  const links = {
    Home: `/dashboard/vehicles`,
    Schedule: `/dashboard/vehicles/schedule`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}

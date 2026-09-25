import { getTranslations } from "next-intl/server"
import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"

type VehicleDetailHeaderTab = "Vehicle" | "Assigned" | "Completed" | "Repairs"

export default async function VehicleDetailHeaderTabs({
  id,
  selectedTab,
}: {
  id: string
  selectedTab: VehicleDetailHeaderTab
}) {
  const t = await getTranslations("Dashboard.VehicleDetailsHeaderTabs")

  const links = {
    Vehicle: `/dashboard/vehicles/${id}`,
    Assigned: `/dashboard/vehicles/${id}/assigned`,
    Completed: `/dashboard/vehicles/${id}/completed`,
    Repairs: `/dashboard/vehicles/${id}/repairs`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}

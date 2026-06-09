import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

type VehicleDetailHeaderTab = "Vehicle" | "Assigned" | "Completed" | "Repairs"

type VehicleDetailHeaderTabsProps = {
  selectedTab: VehicleDetailHeaderTab
  id: string
}
export default async function VehicleDetailHeaderTabs(
  props: VehicleDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.VehicleDetailsHeaderTabs")

  const links = {
    Vehicle: `/dashboard/vehicles/${props.id}`,
    Assigned: `/dashboard/vehicles/${props.id}/assigned`,
    Completed: `/dashboard/vehicles/${props.id}/completed`,
    Repairs: `/dashboard/vehicles/${props.id}/repairs`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <RyogoH2 color="brand">{props.id}</RyogoH2>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as VehicleDetailHeaderTab[]).map((tab) => (
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

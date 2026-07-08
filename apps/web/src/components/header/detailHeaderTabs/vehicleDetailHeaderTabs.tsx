import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { SectionRowWrapper } from "@/components/page/pageWrappers"

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
    <div className="flex flex-col md:flex-row justify-between items-center">
      <SectionRowWrapper>
        <RyogoH2 color="brand">{id}</RyogoH2>
        <CopyClipboardButton />
      </SectionRowWrapper>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as VehicleDetailHeaderTab[]).map((tab) => (
          <Link href={links[tab]} key={tab}>
            <DetailsHeaderTabItem
              label={t(tab)}
              selected={selectedTab === tab}
            />
          </Link>
        ))}
      </DetailsHeaderTabWrapper>
    </div>
  )
}

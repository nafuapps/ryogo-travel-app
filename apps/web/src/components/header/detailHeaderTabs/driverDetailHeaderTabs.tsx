import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { SectionRowWrapper } from "@/components/page/pageWrappers"

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
    <div className="flex flex-col md:flex-row justify-between items-center">
      <SectionRowWrapper>
        <RyogoH2 color="brand">{id}</RyogoH2>
        <CopyClipboardButton />
      </SectionRowWrapper>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as DriverDetailHeaderTab[]).map((tab) => (
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

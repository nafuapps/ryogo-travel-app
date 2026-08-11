import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"

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
    <DetailsHeaderTabWrapper>
      {(Object.keys(links) as DriverDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <DetailsHeaderTabItem label={t(tab)} selected={selectedTab === tab} />
        </Link>
      ))}
    </DetailsHeaderTabWrapper>
  )
}

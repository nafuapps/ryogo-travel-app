import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"
import { useTranslations } from "next-intl"

type MissionDetailHeaderTab = "Missions" | "ExpiryAlerts"

export default function MissionDetailHeaderTabs({
  selectedTab,
}: {
  selectedTab: MissionDetailHeaderTab
}) {
  const t = useTranslations("Dashboard.MissionDetailsHeaderTabs")
  const links = {
    Missions: `/dashboard/missions`,
    ExpiryAlerts: `/dashboard/missions/expiry-alerts`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}

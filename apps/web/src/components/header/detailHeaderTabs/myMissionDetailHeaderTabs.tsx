import { DetailsHeaderTabWrapper } from "@/components/header/detailHeaderTabs/detailHeaderWrappers"
import { useTranslations } from "next-intl"

type MyMissionDetailHeaderTab = "Missions" | "ExpiryAlerts" | "Reminders"

export default function MyMissionDetailHeaderTabs({
  selectedTab,
}: {
  selectedTab: MyMissionDetailHeaderTab
}) {
  const t = useTranslations("Dashboard.MissionDetailsHeaderTabs")

  const links = {
    Missions: `/rider/myMissions`,
    ExpiryAlerts: `/rider/myMissions/myExpiryAlerts`,
    Reminders: `/rider/myMissions/myReminders`,
  } as const

  return (
    <DetailsHeaderTabWrapper
      links={links}
      selectedTab={selectedTab}
      getLabel={(tab) => t(tab)}
    />
  )
}

"use client"

import MissionCard from "@/components/missions/missionCard"
import {
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import Link from "next/link"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import MissionsFiltersCard from "@/components/filter/missionsFiltersCard"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { RyogoCaption } from "@/components/typography"
import { AlarmClockMinus } from "lucide-react"
import { Route } from "next"
import { useTranslations } from "next-intl"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default async function MyMissionsPageComponent({
  missions,
  isPremium,
}: {
  missions: FindMissionsByUserIdType
  isPremium: boolean
}) {
  const t = useTranslations("Dashboard.Missions")
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const critical = searchParams.get("critical")
  const read = searchParams.get("read")
  const custom = searchParams.get("custom")

  const filteredMissions = missions.filter((mission) => {
    return (
      (critical === null || mission.isCritical === (critical === "True")) &&
      (read === null || mission.isRead === (read === "True")) &&
      (custom === null || mission.isCustom === (custom === "True"))
    )
  })
  return (
    <PageWrapper id="MyMissionsPage">
      <MissionsFiltersCard isPremium={isPremium} />
      <SectionRowWrapper className="w-full items-center justify-between">
        <RyogoCaption color="light">
          {t("Missions") + " (" + filteredMissions.length + ")"}
        </RyogoCaption>
        <RyogoGhostButton
          label={t("ClearFilters")}
          labelColor="light"
          onClick={() => router.push(pathname as Route)}
          disabled={searchParams.size === 0}
        />
      </SectionRowWrapper>
      {filteredMissions.length > 0 ? (
        filteredMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))
      ) : (
        <EmptyStateIcon icon={AlarmClockMinus} label={t("NoMissions")} />
      )}
      <StickyActionWrapper>
        {isPremium && (
          <Link href={`/rider/myMissions/add`} className="w-full">
            <RyogoDefaultButton
              size="lg"
              label={t("AddCustomMission")}
              className="w-full"
            />
          </Link>
        )}
        <HelpIconButton
          href={"/rider/mySupport/help-missions"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

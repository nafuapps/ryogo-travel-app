"use client"

import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import MissionsFiltersCard from "@/components/filter/missionsFiltersCard"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import MissionCard from "@/components/missions/missionCard"
import {
  SectionRowWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { RyogoCaption } from "@/components/typography"
import { usePagination } from "@/hooks/usePagination"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { FlagOff } from "lucide-react"
import { Route } from "next"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const MISSIONS_PER_PAGE = 5

export default function MissionsPageComponent({
  missions,
}: {
  missions: FindMissionsByUserIdType
}) {
  const t = useTranslations("Dashboard.Missions")
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const critical = searchParams.get("critical")
  const read = searchParams.get("read")
  const due = searchParams.get("due")
  const type = searchParams.get("type")

  const filteredMissions = missions.filter((mission) => {
    return (
      (critical === null || mission.isCritical === (critical === "True")) &&
      (read === null || mission.isRead === (read === "True")) &&
      (type === null || mission.entityType === (type as EntityTypeEnum)) &&
      (due === null ||
        (mission.dueDate && mission.dueDate <= new Date()) === (due === "True"))
    )
  })

  //Pagination of missions
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(filteredMissions, MISSIONS_PER_PAGE)

  return (
    <>
      <MissionsFiltersCard />
      <SectionRowWrapper className="w-full items-center justify-between">
        <RyogoCaption color="light">
          {searchParams.size === 0
            ? t("AllMissions", { count: missions.length })
            : t("FilteredMissions", { count: filteredMissions.length })}
        </RyogoCaption>
        <RyogoGhostButton
          label={t("ClearFilters")}
          labelColor="light"
          onClick={() => router.push(pathname as Route)}
          disabled={searchParams.size === 0}
        />
      </SectionRowWrapper>
      <TileGridWrapper>
        {currentItems.length > 0 ? (
          currentItems.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))
        ) : (
          <EmptyStateIcon icon={FlagOff} label={t("NoMissions")} />
        )}
      </TileGridWrapper>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

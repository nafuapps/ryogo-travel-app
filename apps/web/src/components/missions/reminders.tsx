"use client"

import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { FindRemindersByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { RyogoCaption } from "@/components/typography"
import { AlarmClockMinus } from "lucide-react"
import { Route } from "next"
import { useTranslations } from "next-intl"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { usePagination } from "@/hooks/usePagination"
import { PaginationControls } from "../pagination/paginationControls"
import ReminderCard from "./reminderCard"
import RemindersFiltersCard from "@/components/filter/remindersFiltersCard"

const REMINDERS_PER_PAGE = 5

export default async function RemindersPageComponent({
  reminders,
  isRider,
}: {
  reminders: FindRemindersByUserIdType
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.Reminders")
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const critical = searchParams.get("critical")
  const done = searchParams.get("done")
  const due = searchParams.get("due")
  const type = searchParams.get("type")

  const filteredReminders = reminders.filter((reminder) => {
    return (
      (critical === null || reminder.isCritical === (critical === "True")) &&
      (done === null || reminder.isRead === (done === "True")) &&
      (type === null || reminder.entityType === (type as EntityTypeEnum)) &&
      (due === null ||
        (reminder.dueDate && reminder.dueDate <= new Date()) ===
          (due === "True"))
    )
  })

  //Pagination of reminders
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(filteredReminders, REMINDERS_PER_PAGE)

  return (
    <>
      <RemindersFiltersCard />
      <SectionRowWrapper className="w-full items-center justify-between">
        <RyogoCaption color="light">
          {searchParams.size === 0
            ? t("AllReminders", { count: reminders.length })
            : t("FilteredReminders", { count: filteredReminders.length })}
        </RyogoCaption>
        <RyogoGhostButton
          label={t("ClearFilters")}
          labelColor="light"
          onClick={() => router.push(pathname as Route)}
          disabled={searchParams.size === 0}
        />
      </SectionRowWrapper>
      <SectionColWrapper className="h-full">
        {currentItems.length > 0 ? (
          currentItems.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              isRider={isRider}
            />
          ))
        ) : (
          <EmptyStateIcon icon={AlarmClockMinus} label={t("NoReminders")} />
        )}
      </SectionColWrapper>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

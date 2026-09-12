"use client"

import FilterCheckboxGroup from "@/components/filter/filterCheckboxGroup"
import NotificationCard from "@/components/notifications/notificationCard"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall } from "@/components/typography"
import { FindFeedNotificationsByAgencyIdType } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function NotificationFeedPageComponent({
  notifications,
}: {
  notifications: FindFeedNotificationsByAgencyIdType
}) {
  const t = useTranslations("Dashboard.Feed")
  const allFilters = Object.values(EntityTypeEnum)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(allFilters)
  const filteredNotifications = notifications.filter((n) =>
    selectedFilters.includes(n.entityType),
  )
  return (
    <PageWrapper id="NotificationFeedPage">
      <FilterCheckboxGroup
        allFilters={allFilters}
        title={t("FeedFilters")}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <SectionColWrapper overflowScroll>
        {filteredNotifications.length === 0 ? (
          <RyogoSmall color="slate">{t("NoFeed")}</RyogoSmall>
        ) : (
          filteredNotifications.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))
        )}
      </SectionColWrapper>
    </PageWrapper>
  )
}

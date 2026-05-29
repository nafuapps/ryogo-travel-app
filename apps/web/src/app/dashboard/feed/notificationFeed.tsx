"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import NotificationCard from "@/components/notifications/notificationCard"
import {
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { FindFeedNotificationsByAgencyIdType } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function NotificationFeedPageComponent({
  notifications,
}: {
  notifications: FindFeedNotificationsByAgencyIdType
}) {
  const t = useTranslations("Dashboard.Feed")
  const entityTypeDisplayPairs = getEnumValueDisplayPairs(EntityTypeEnum)
  const [selectedFilters, setSelectedFilters] = useState<EntityTypeEnum[]>(
    entityTypeDisplayPairs.map((pair) => pair.value),
  )
  const filteredNotifications = notifications.filter((n) =>
    selectedFilters.includes(n.entityType),
  )
  return (
    <PageWrapper id="NotificationFeedPage">
      <FilterCheckboxGroup
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

function FilterCheckboxGroup({
  selectedFilters,
  setSelectedFilters,
}: {
  selectedFilters: EntityTypeEnum[]
  setSelectedFilters: (filters: EntityTypeEnum[]) => void
}) {
  const t = useTranslations("Dashboard.Feed")
  const [open, setOpen] = useState(false)
  const entityTypeDisplayPairs = getEnumValueDisplayPairs(EntityTypeEnum)

  return (
    <SectionWrapper id="FeedFilters">
      <FieldSet className="gap-4">
        <SectionRowWrapper center onClick={() => setOpen(!open)}>
          <RyogoCaption color="light">{t("FeedFilters")}</RyogoCaption>
          <RyogoIcon
            icon={open ? ChevronUp : ChevronDown}
            size="sm"
            color="slate"
          />
        </SectionRowWrapper>
        <FieldGroup
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${open ? "" : "hidden"}`}
        >
          {entityTypeDisplayPairs.map((pair) => (
            <Field
              orientation="horizontal"
              key={pair.value}
              className="gap-1.5"
            >
              <Checkbox
                id={pair.value}
                name={pair.value}
                checked={selectedFilters.includes(pair.value)}
                onCheckedChange={() => {
                  const newFilters = selectedFilters.includes(pair.value)
                    ? selectedFilters.filter((v) => v !== pair.value)
                    : [...selectedFilters, pair.value]
                  setSelectedFilters(newFilters)
                }}
              />
              <RyogoCaption>{pair.display}</RyogoCaption>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
    </SectionWrapper>
  )
}

"use client"

import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import FilterCheckboxGroup from "@/components/filter/filterCheckboxGroup"
import SupportTicketItem from "@/components/flows/support/supportTicketItem"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import {
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { Switch } from "@/components/ui/switch"
import {
  FindSupportTicketsByAgencyIdType,
  FindSupportTicketsByUserIdType,
} from "@ryogo-travel-app/api/services/support.services"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { TicketSlash } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"

export default function SupportTicketsPageComponent({
  isOwner,
  tickets,
  userId,
}: {
  isOwner: boolean
  tickets: FindSupportTicketsByAgencyIdType | FindSupportTicketsByUserIdType
  userId: string
}) {
  const t = useTranslations("Dashboard.SupportTickets")

  const [showAgencyTickets, setShowAgencyTickets] = useState(false)

  const allTickets = showAgencyTickets
    ? tickets
    : tickets.filter((t) => t.userId === userId)

  const allFilters = Object.values(TicketStatusEnum)

  const [selectedFilters, setSelectedFilters] = useState<string[]>(allFilters)

  const filteredTickets = allTickets.filter((t) =>
    selectedFilters.includes(t.status),
  )

  return (
    <PageWrapper id="SupportTicketsPage">
      <FilterCheckboxGroup
        allFilters={allFilters}
        title={t("TicketStatusFilters")}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <SectionRowWrapper className="w-full items-center justify-between">
        <RyogoCaption color="light">
          {t("FilteredTickets") + " (" + filteredTickets.length + ")"}
        </RyogoCaption>
        {isOwner && (
          <SectionRowWrapper className="items-center justify-end">
            <RyogoCaption color="light">{t("ShowAgencyTickets")}</RyogoCaption>
            <Switch
              id="agencyTickets"
              checked={showAgencyTickets}
              onCheckedChange={setShowAgencyTickets}
            />
          </SectionRowWrapper>
        )}
      </SectionRowWrapper>
      {filteredTickets.length === 0 ? (
        <EmptyStateIcon label={t("NoTickets")} icon={TicketSlash} />
      ) : (
        <SectionColWrapper className="overflow-y-scroll no-scrollbar">
          {filteredTickets.map((ticket) => (
            <SupportTicketItem key={ticket.id} ticket={ticket} />
          ))}
        </SectionColWrapper>
      )}
      <StickyActionWrapper>
        <Link href={`/dashboard/support/tickets/add`}>
          <RyogoDefaultButton label={t("AddTicket")} className="w-full" />
        </Link>
      </StickyActionWrapper>
    </PageWrapper>
  )
}

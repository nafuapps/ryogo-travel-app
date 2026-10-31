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
import { FindSupportTicketsByUserIdType } from "@ryogo-travel-app/api/services/support.services"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { TicketSlash } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"

export default function MySupportTicketsPageComponent({
  tickets,
}: {
  tickets: FindSupportTicketsByUserIdType
}) {
  const t = useTranslations("Rider.MySupportTickets")

  const allFilters = Object.values(TicketStatusEnum)

  const [selectedFilters, setSelectedFilters] = useState<string[]>(allFilters)

  const filteredTickets = tickets.filter((t) =>
    selectedFilters.includes(t.status),
  )

  return (
    <PageWrapper id="MySupportTicketsPage">
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
        <Link href={`/rider/mySupport/tickets/add`}>
          <RyogoDefaultButton label={t("AddTicket")} className="w-full" />
        </Link>
      </StickyActionWrapper>
    </PageWrapper>
  )
}

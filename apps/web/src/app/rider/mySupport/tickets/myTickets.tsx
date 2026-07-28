"use client"

import FilterCheckboxGroup from "@/components/filter/filterCheckboxGroup"
import SupportTicketItem from "@/components/flows/support/supportTicketItem"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { PageWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { FindSupportTicketsByUserIdType } from "@ryogo-travel-app/api/services/support.services"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"

export default function MySupportTicketsPageComponent({
  tickets,
}: {
  tickets: FindSupportTicketsByUserIdType
}) {
  const t = useTranslations("Rider.MySupportTickets")

  const ticketStatusPairs = getEnumValueDisplayPairs(TicketStatusEnum)

  const [selectedFilters, setSelectedFilters] = useState<TicketStatusEnum[]>(
    ticketStatusPairs.map((pair) => pair.value),
  )

  const filteredTickets = tickets.filter((t) =>
    selectedFilters.includes(t.status),
  )

  return (
    <PageWrapper id="MySupportTicketsPage">
      <Link
        href={`/rider/mySupport/tickets/add`}
        className="w-full md:w-1/2 self-center"
      >
        <Button variant={"outline"} className="w-full">
          <RyogoIcon icon={Plus} size="sm" color="slate" />
          <RyogoCaption color="slate">{t("AddTicket")}</RyogoCaption>
        </Button>
      </Link>
      <FilterCheckboxGroup<TicketStatusEnum>
        enumValueDisplayPairs={ticketStatusPairs}
        title={t("TicketStatusFilters")}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      {filteredTickets.length === 0 ? (
        <RyogoSmall color="light" className="mx-auto">
          {t("NoTickets")}
        </RyogoSmall>
      ) : (
        <div className="flex flex-col gap-3 lg:gap-4">
          {filteredTickets.map((ticket) => (
            <SupportTicketItem key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

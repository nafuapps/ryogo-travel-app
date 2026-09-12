"use client"

import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import FilterCheckboxGroup from "@/components/filter/filterCheckboxGroup"
import SupportTicketItem from "@/components/flows/support/supportTicketItem"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { PageWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall } from "@/components/typography"
import { Switch } from "@/components/ui/switch"
import {
  FindSupportTicketsByAgencyIdType,
  FindSupportTicketsByUserIdType,
} from "@ryogo-travel-app/api/services/support.services"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { Plus } from "lucide-react"
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
      <Link
        href={`/dashboard/support/tickets/add`}
        className="w-full md:w-1/2 self-center"
      >
        <RyogoOutlineButton label={t("AddTicket")} className="w-full">
          <RyogoIcon icon={Plus} size="sm" color="slate" />
        </RyogoOutlineButton>
      </Link>
      <FilterCheckboxGroup
        allFilters={allFilters}
        title={t("TicketStatusFilters")}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      {isOwner && (
        <div className="flex items-center gap-2 lg:gap-3 justify-end">
          <RyogoSmall color="light">{t("ShowAgencyTickets")}</RyogoSmall>
          <Switch
            id="agencyTickets"
            checked={showAgencyTickets}
            onCheckedChange={setShowAgencyTickets}
          />
        </div>
      )}
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

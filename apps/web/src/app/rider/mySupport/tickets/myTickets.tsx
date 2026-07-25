"use client"

import SupportTicketItem from "@/components/flows/support/supportTicketItem"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { PageWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { FindSupportTicketsByUserIdType } from "@ryogo-travel-app/api/services/support.services"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function MySupportTicketsPageComponent({
  tickets,
}: {
  tickets: FindSupportTicketsByUserIdType
}) {
  const t = useTranslations("Rider.MySupportTickets")

  return (
    <PageWrapper id="MySupportTicketsPage">
      <Link
        href={`/rider/mySupport/tickets/add`}
        className="w-full md:w-1/2 self-center"
      >
        <Button variant={"outline"} className="w-full">
          <RyogoIcon icon={Plus} size="sm" color="slate" />
          <RyogoCaption>{t("AddTicket")}</RyogoCaption>
        </Button>
      </Link>
      {tickets.length === 0 && (
        <RyogoSmall color="light" className="mx-auto">
          {t("NoTickets")}
        </RyogoSmall>
      )}
      <div className="flex flex-col gap-3 lg:gap-4">
        {tickets.map((ticket) => (
          <SupportTicketItem key={ticket.id} ticket={ticket} isRider />
        ))}
      </div>
    </PageWrapper>
  )
}

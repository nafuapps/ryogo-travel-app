import getEntityIcon from "@/components/icons/entityIcon"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { SupportTicketStatusPill } from "@/components/pills/ryogoPills"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import {
  FindSupportTicketsByAgencyIdType,
  FindSupportTicketsByUserIdType,
} from "@ryogo-travel-app/api/services/support.services"
import moment from "moment"
import Link from "next/link"

export default function SupportTicketItem({
  ticket,
  isRider,
}: {
  ticket:
    | FindSupportTicketsByAgencyIdType[number]
    | FindSupportTicketsByUserIdType[number]
  isRider?: boolean
}) {
  return (
    <Link
      href={
        isRider
          ? `/rider/mySupport/tickets/${ticket.id}`
          : `/dashboard/support/tickets/${ticket.id}`
      }
    >
      <SectionWrapper id={ticket.id}>
        <SectionRowWrapper className="items-center">
          <RyogoSmall weight="font-bold" color="light">
            {"# " + ticket.id}
          </RyogoSmall>
          <SupportTicketStatusPill status={ticket.status} />
        </SectionRowWrapper>
        <RyogoP weight="font-bold">{ticket.issue}</RyogoP>
        <SectionRowWrapper className="items-center">
          <SectionRowWrapper className="items-center justify-start">
            <RyogoEnclosedIcon
              icon={getEntityIcon(ticket.entityType)}
              size="sm"
              color={"slate"}
              circular
            />
            <SectionColWrapper small>
              <RyogoCaption color={"slate"} weight="font-bold">
                {ticket.entityType}
              </RyogoCaption>
              {ticket.entityId && (
                <RyogoCaption color={"slate"}>
                  {"(" + ticket.entityId + ")"}
                </RyogoCaption>
              )}
            </SectionColWrapper>
          </SectionRowWrapper>
          <RyogoCaption color="slate">
            {moment(ticket.createdAt).format("DD MMM")}
          </RyogoCaption>
        </SectionRowWrapper>
        {"user" in ticket && (
          <RyogoImageIconTag
            url={ticket.user.photoUrl}
            label={ticket.user.name}
          />
        )}
      </SectionWrapper>
    </Link>
  )
}

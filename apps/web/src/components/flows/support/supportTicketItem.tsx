import getEntityIcon from "@/components/icons/entityIcon"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { SupportTicketStatusPill } from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import {
  FindSupportTicketsByAgencyIdType,
  FindSupportTicketsByUserIdType,
} from "@ryogo-travel-app/api/services/support.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
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
        <SectionRowWrapper center>
          <RyogoSmall weight="font-bold" color="light">
            {"# " + ticket.id}
          </RyogoSmall>
          <SupportTicketStatusPill status={ticket.status} />
        </SectionRowWrapper>
        <RyogoP weight="font-bold">{ticket.issue}</RyogoP>
        <SectionRowWrapper center>
          <SectionRowWrapper justifyStart center>
            <RyogoEnclosedIcon
              icon={getEntityIcon(ticket.entityType)}
              size="sm"
              color={"slate"}
              bgColor={"slate"}
              circular
            />
            <SectionColWrapper small>
              <RyogoCaption color={"slate"} weight="font-bold">
                {ticket.entityType.toUpperCase()}
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
          <SectionRowWrapper justifyStart center>
            {ticket.user.photoUrl ? (
              <RyogoImage
                src={getFileUrl(ticket.user.photoUrl)}
                alt={ticket.user.name}
                imageSize="xs"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="sm" />
            )}
            <RyogoCaption color={"slate"} className="text-center">
              {ticket.user.name}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
      </SectionWrapper>
    </Link>
  )
}

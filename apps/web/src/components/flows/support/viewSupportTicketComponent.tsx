import DeleteSupportTicketAlertButton from "@/components/buttons/alert/deleteSupportTicketAlertButton"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import {
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { SupportTicketStatusPill } from "@/components/pills/ryogoPills"
import { RyogoSingleRatingDisplay } from "@/components/ratings/ryogoRatingDisplay"
import AddSupportTicketCommentSheet from "@/components/sheets/addSupportTicketCommentSheet"
import ChangeTicketPhotoSheet from "@/components/sheets/changeTicketPhotoSheet"
import CloseSupportTicketSheet from "@/components/sheets/closeSupportTicketSheet"
import {
  RyogoCaption,
  RyogoH3,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { MAX_USER_COMMENTS_PER_TICKET } from "@/lib/uiConfig"
import { FindSupportTicketByIdType } from "@ryogo-travel-app/api/services/support.services"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { MessageSquareReply, MessageSquare } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"

export default async function ViewSupportTicketPageComponent({
  ticket,
  isRider,
}: {
  ticket: NonNullable<FindSupportTicketByIdType>
  isRider?: boolean
}) {
  const t = await getTranslations("Dashboard.ViewSupportTicket")
  const userCommentsLength = ticket.commentsByUser?.length ?? 0

  return (
    <PageWrapper id="ViewSupportTicketPage">
      <SectionWrapper id="TicketDataSection">
        <SectionRowWrapper center>
          <SectionRowWrapper justifyStart center>
            <RyogoH3 color="brand">{ticket.id}</RyogoH3>
            <CopyClipboardButton label={ticket.id} />
          </SectionRowWrapper>
          <SupportTicketStatusPill status={ticket.status} />
        </SectionRowWrapper>
        <Separator />
        <TicketRow label={t("Created")}>
          <RyogoSmall>{moment(ticket.createdAt).fromNow()}</RyogoSmall>
        </TicketRow>
        <TicketRow label={t("EntityType")}>
          <RyogoSmall>{ticket.entityType.toUpperCase()}</RyogoSmall>
        </TicketRow>
        {ticket.entityId && (
          <TicketRow label={t("EntityId")}>
            <RyogoSmall>{ticket.entityId}</RyogoSmall>
          </TicketRow>
        )}
        {ticket.resolutionRating &&
          ticket.status === TicketStatusEnum.CLOSED && (
            <TicketRow label={t("ResolutionRating")}>
              <RyogoSingleRatingDisplay
                total={5}
                rating={ticket.resolutionRating}
              />
            </TicketRow>
          )}
        <Separator />
        <RyogoP weight="font-bold">{ticket.issue}</RyogoP>
        {ticket.details && (
          <RyogoCaption color="light">{ticket.details}</RyogoCaption>
        )}
      </SectionWrapper>
      <SectionWrapper id="TicketPhotoSection">
        <SectionColWrapper center>
          {ticket.photoUrl && (
            <RyogoDialogImage
              src={getFileUrl(ticket.photoUrl)}
              alt="Support Ticket Image"
              imageSize="xl"
            />
          )}
          {[TicketStatusEnum.OPEN, TicketStatusEnum.IN_PROGRESS].includes(
            ticket.status,
          ) && (
            <ChangeTicketPhotoSheet
              ticketId={ticket.id}
              userId={ticket.userId}
              newPhoto={ticket.photoUrl ? false : true}
            />
          )}
        </SectionColWrapper>
      </SectionWrapper>

      {userCommentsLength > 0 && (
        <SectionWrapper id="TicketCommentsByUser">
          <RyogoCaption weight="font-bold" color="light">
            {t("CommentsByUser")}
          </RyogoCaption>
          {ticket.commentsByUser?.map((comment, index) => (
            <SectionColWrapper key={index}>
              <SectionRowWrapper justifyStart>
                <RyogoIcon icon={MessageSquare} size="sm" />
                <RyogoSmall>{comment}</RyogoSmall>
              </SectionRowWrapper>
              {index < userCommentsLength - 1 && <Separator />}
            </SectionColWrapper>
          ))}
        </SectionWrapper>
      )}
      {ticket.commentBySupport && (
        <SectionWrapper id="TicketCommentBySupport">
          <RyogoCaption weight="font-bold" color="light">
            {t("CommentBySupport")}
          </RyogoCaption>
          <SectionRowWrapper justifyStart>
            <RyogoIcon icon={MessageSquareReply} size="sm" />
            <RyogoSmall>{ticket.commentBySupport}</RyogoSmall>
          </SectionRowWrapper>
        </SectionWrapper>
      )}
      {ticket.status !== TicketStatusEnum.CLOSED && (
        <SectionWrapper id="TicketActions">
          {[TicketStatusEnum.OPEN, TicketStatusEnum.IN_PROGRESS].includes(
            ticket.status,
          ) &&
            userCommentsLength < MAX_USER_COMMENTS_PER_TICKET && (
              <AddSupportTicketCommentSheet
                ticketId={ticket.id}
                userId={ticket.userId}
                agencyId={ticket.agencyId}
                status={ticket.status}
              />
            )}
          {ticket.status === TicketStatusEnum.RESOLVED && (
            <>
              <CloseSupportTicketSheet
                ticketId={ticket.id}
                userId={ticket.userId}
                agencyId={ticket.agencyId}
                status={ticket.status}
              />
              <RyogoCaption color="light" className="text-center mx-auto">
                {t("CloseTicketDesc")}
              </RyogoCaption>
            </>
          )}
          {ticket.status === TicketStatusEnum.OPEN && (
            <DeleteSupportTicketAlertButton
              ticketId={ticket.id}
              userId={ticket.userId}
              agencyId={ticket.agencyId}
              status={ticket.status}
              isRider={isRider}
            />
          )}
        </SectionWrapper>
      )}
    </PageWrapper>
  )
}

function TicketRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <SectionRowWrapper center>
      <RyogoCaption weight="font-bold" color="light">
        {label}
      </RyogoCaption>
      {children}
    </SectionRowWrapper>
  )
}

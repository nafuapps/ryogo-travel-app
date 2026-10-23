"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function closeSupportTicketAction({
  ticketId,
  userId,
  agencyId,
  resolutionRating,
}: {
  ticketId: string
  userId: string
  agencyId: string
  resolutionRating?: number
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const ticket = await supportServices.closeTicketWithRating({
    ticketId,
    resolutionRating,
  })

  if (!ticket) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.SUPPORT,
    entityId: ticket.id,
    textKey: "TicketClosed",
    textObject: {
      ticketId: ticket.id,
      userName: currentUser.name,
    },
    link: `/dashboard/support/tickets/${ticket.id}`,
  })

  return ticket
}

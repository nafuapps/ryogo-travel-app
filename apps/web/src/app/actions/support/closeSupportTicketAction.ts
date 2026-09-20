"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { EntityTypeEnum, TicketStatusEnum } from "@ryogo-travel-app/db/schema"

export async function closeSupportTicketAction(
  ticketId: string,
  userId: string,
  agencyId: string,
  status: TicketStatusEnum,
  rating?: number,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId ||
    status !== TicketStatusEnum.RESOLVED
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const ticket = await supportServices.closeTicketWithRating(ticketId, rating)

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

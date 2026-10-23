"use server"

import { writePermissions } from "@/lib/permissions"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function deleteSupportTicketAction({
  ticketId,
  userId,
  agencyId,
}: {
  ticketId: string
  userId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const removedTicket = await supportServices.removeTicket(ticketId)
  if (!removedTicket) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.SUPPORT,
    entityId: removedTicket.id,
    textKey: "TicketRemoved",
    textObject: {
      ticketId: removedTicket.id,
      userName: currentUser.name,
    },
    link: `/dashboard/support/tickets/${removedTicket.id}`,
  })

  return removedTicket
}

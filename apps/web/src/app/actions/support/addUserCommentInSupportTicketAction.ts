"use server"

import { writePermissions } from "@/lib/permissions"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"

export async function addUserCommentInSupportTicketAction({
  ticketId,
  userId,
  agencyId,
  comment,
}: {
  ticketId: string
  userId: string
  agencyId: string
  comment: string
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const ticket = await supportServices.addSupportTicketUserComment({
    ticketId,
    comment,
  })

  return ticket
}

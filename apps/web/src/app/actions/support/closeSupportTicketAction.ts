"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"

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

  return ticket
}

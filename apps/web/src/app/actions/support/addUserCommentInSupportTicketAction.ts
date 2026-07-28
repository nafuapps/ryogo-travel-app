"use server"

import { getCurrentUser } from "@/lib/auth"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export async function addUserCommentInSupportTicketAction(
  ticketId: string,
  userId: string,
  agencyId: string,
  status: TicketStatusEnum,
  comment: string,
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  if (
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId ||
    status === TicketStatusEnum.CLOSED
  ) {
    return
  }

  const ticket = await supportServices.addSupportTicketUserComment(
    ticketId,
    comment,
  )

  return ticket
}

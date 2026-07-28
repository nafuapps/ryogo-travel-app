"use server"

import { getCurrentUser } from "@/lib/auth"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export async function deleteSupportTicketAction(
  ticketId: string,
  userId: string,
  agencyId: string,
  status: TicketStatusEnum,
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  if (
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId ||
    status !== TicketStatusEnum.OPEN
  ) {
    return
  }

  const ticket = await supportServices.removeTicket(ticketId)

  return ticket
}

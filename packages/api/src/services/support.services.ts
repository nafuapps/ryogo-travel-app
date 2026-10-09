import {
  InsertSupportQueryType,
  InsertSupportTicketType,
  TicketStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { supportQueryRepository } from "../repositories/supportQuery.repo"
import { supportTicketRepository } from "../repositories/supportTicket.repo"

export const supportServices = {
  async addSupportQuery(query: InsertSupportQueryType) {
    const [newQuery] = await supportQueryRepository.createSupportQuery(query)
    return newQuery
  },

  async addSupportTicket(ticket: InsertSupportTicketType) {
    const [newTicket] =
      await supportTicketRepository.createSupportTicket(ticket)
    return newTicket
  },

  async findSupportTicketById(ticketId: string) {
    const ticket = await supportTicketRepository.readSupportTicketById(ticketId)
    return ticket
  },

  async findSupportTicketsByUserId(userId: string) {
    const tickets =
      await supportTicketRepository.readSupportTicketsByUserId(userId)
    return tickets
  },

  async findSupportTicketsByAgencyId(agencyId: string) {
    const tickets =
      await supportTicketRepository.readSupportTicketsByAgencyId(agencyId)
    return tickets
  },

  async updateSupportTicketPhoto({
    ticketId,
    photoUrl,
  }: {
    ticketId: string
    photoUrl: string
  }) {
    const [updatedTicket] = await supportTicketRepository.updatePhotoUrl({
      ticketId,
      photoUrl,
    })
    return updatedTicket
  },

  async closeTicketWithRating({
    ticketId,
    resolutionRating,
  }: {
    ticketId: string
    resolutionRating?: number
  }) {
    const ticket = await supportTicketRepository.readSupportTicketById(ticketId)
    if (!ticket || ticket.status !== TicketStatusEnum.RESOLVED) return

    const [closedTicket] =
      await supportTicketRepository.updateTicketStatusWithRating({
        ticketId,
        status: TicketStatusEnum.CLOSED,
        resolutionRating,
      })
    return closedTicket
  },

  async addSupportTicketUserComment({
    ticketId,
    comment,
  }: {
    ticketId: string
    comment: string
  }) {
    const [updatedTicket] =
      await supportTicketRepository.updateTicketCommentsByUser({
        ticketId,
        comment,
      })
    return updatedTicket
  },

  async removeTicket(ticketId: string) {
    const ticket = await supportTicketRepository.readSupportTicketById(ticketId)
    if (!ticket || ticket.status !== TicketStatusEnum.OPEN) return

    const [removedTicket] =
      await supportTicketRepository.deleteSupportTicket(ticketId)
    return removedTicket
  },
}

export type FindSupportTicketByIdType = Awaited<
  ReturnType<typeof supportServices.findSupportTicketById>
>
export type FindSupportTicketsByUserIdType = Awaited<
  ReturnType<typeof supportServices.findSupportTicketsByUserId>
>
export type FindSupportTicketsByAgencyIdType = Awaited<
  ReturnType<typeof supportServices.findSupportTicketsByAgencyId>
>

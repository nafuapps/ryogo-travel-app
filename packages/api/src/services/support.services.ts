import {
  InsertSupportQueryType,
  InsertSupportTicketType,
  TicketStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { supportQueryRepository } from "../repositories/supportQuery.repo"
import { supportTicketRepository } from "../repositories/supportTicket.repo"

export const supportServices = {
  async addSupportQuery(query: InsertSupportQueryType) {
    const newQuery = await supportQueryRepository.createSupportQuery(query)
    return newQuery[0]
  },

  async addSupportTicket(ticket: InsertSupportTicketType) {
    const newTicket = await supportTicketRepository.createSupportTicket(ticket)
    return newTicket[0]
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

  async updateSupportTicketPhoto(ticketId: string, photoUrl: string) {
    return (await supportTicketRepository.updatePhotoUrl(ticketId, photoUrl))[0]
  },

  async closeTicketWithRating(ticketId: string, rating?: number) {
    return (
      await supportTicketRepository.updateTicketStatusWithRating(
        ticketId,
        TicketStatusEnum.CLOSED,
        rating,
      )
    )[0]
  },
  async addSupportTicketUserComment(ticketId: string, comment: string) {
    return (
      await supportTicketRepository.updateTicketCommentsByUser(
        ticketId,
        comment,
      )
    )[0]
  },

  async removeTicket(ticketId: string) {
    return (await supportTicketRepository.deleteSupportTicket(ticketId))[0]
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

import {
  InsertSupportQueryType,
  InsertSupportTicketType,
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
    await supportTicketRepository.updatePhotoUrl(ticketId, photoUrl)
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

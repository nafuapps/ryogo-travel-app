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
}

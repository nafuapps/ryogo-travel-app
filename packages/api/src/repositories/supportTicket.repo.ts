import { db } from "@ryogo-travel-app/db"
import {
  supportTickets,
  InsertSupportTicketType,
} from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const supportTicketRepository = {
  async createSupportTicket(ticket: InsertSupportTicketType) {
    return await db.insert(supportTickets).values(ticket).returning()
  },

  async readSupportTicketById(ticketId: string) {
    return await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, ticketId),
    })
  },

  async readSupportTicketsByUserId(userId: string) {
    return await db.query.supportTickets.findMany({
      where: eq(supportTickets.userId, userId),
    })
  },

  async readSupportTicketsByAgencyId(agencyId: string) {
    return await db.query.supportTickets.findMany({
      where: eq(supportTickets.agencyId, agencyId),
    })
  },
}

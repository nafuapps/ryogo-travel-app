import { db } from "@ryogo-travel-app/db"
import {
  supportTickets,
  InsertSupportTicketType,
} from "@ryogo-travel-app/db/schema"

export const supportTicketRepository = {
  async createSupportTicket(ticket: InsertSupportTicketType) {
    return await db.insert(supportTickets).values(ticket).returning()
  },
}

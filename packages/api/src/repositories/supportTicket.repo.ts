import { db } from "@ryogo-travel-app/db"
import {
  supportTickets,
  InsertSupportTicketType,
  TicketStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, sql } from "drizzle-orm"

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
      orderBy: (supportTickets, { desc }) => [desc(supportTickets.updatedAt)],
    })
  },

  async readSupportTicketsByAgencyId(agencyId: string) {
    return await db.query.supportTickets.findMany({
      where: eq(supportTickets.agencyId, agencyId),
      orderBy: (supportTickets, { desc }) => [desc(supportTickets.updatedAt)],
    })
  },

  async updatePhotoUrl(ticketId: string, photoUrl: string) {
    return await db
      .update(supportTickets)
      .set({ photoUrl: photoUrl })
      .where(eq(supportTickets.id, ticketId))
      .returning({ id: supportTickets.id, photoUrl: supportTickets.photoUrl })
  },

  async updateTicketStatusWithRating(
    ticketId: string,
    status: TicketStatusEnum,
    resolutionRating?: number,
  ) {
    return await db
      .update(supportTickets)
      .set({ status, resolutionRating })
      .where(eq(supportTickets.id, ticketId))
      .returning({
        id: supportTickets.id,
        status: supportTickets.status,
        resolutionRating: supportTickets.resolutionRating,
      })
  },

  async updateTicketCommentsByUser(ticketId: string, comment: string) {
    return await db
      .update(supportTickets)
      .set({
        commentsByUser: sql`array_append(${supportTickets.commentsByUser}, ${comment})`,
      })
      .where(eq(supportTickets.id, ticketId))
      .returning({
        id: supportTickets.id,
        commentsByUser: supportTickets.commentsByUser,
      })
  },

  async deleteSupportTicket(ticketId: string) {
    return await db
      .delete(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .returning({ id: supportTickets.id })
  },
}

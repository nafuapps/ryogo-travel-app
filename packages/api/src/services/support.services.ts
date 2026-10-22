import {
  AgencyStatusEnum,
  InsertSupportQueryType,
  InsertSupportTicketType,
  SubscriptionPlanEnum,
  TicketStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { APP_TRIAL_MODE } from "../apiConfig"
import { agencyRepository } from "../repositories/agency.repo"
import { supportQueryRepository } from "../repositories/supportQuery.repo"
import { supportTicketRepository } from "../repositories/supportTicket.repo"

export const supportServices = {
  async addSupportQuery(query: InsertSupportQueryType) {
    const [newQuery] = await supportQueryRepository.createSupportQuery(query)
    return newQuery
  },

  async addSupportTicket(ticket: InsertSupportTicketType) {
    const agency = await agencyRepository.readAgencyById(ticket.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${ticket.agencyId}`)
      return
    }
    //SUBSCRIPTION CHECK: Only premium agency can create custom reminders
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        agency.subscriptionExpiresOn < new Date())
    ) {
      console.error(
        `Basic plan cannot create support tickets: ${ticket.agencyId}`,
      )
      return
    }

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
    if (!ticket || ticket.status !== TicketStatusEnum.RESOLVED) {
      console.error(`Ticket not found or not resolved: ${ticketId}`)
      return
    }

    const agency = await agencyRepository.readAgencyById(ticket.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${ticket.agencyId}`)
      return
    }
    //SUBSCRIPTION CHECK: Only premium agency can close ticket
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        agency.subscriptionExpiresOn < new Date())
    ) {
      console.error(
        `Basic plan cannot update support tickets: ${ticket.agencyId} ${ticketId}`,
      )
      return
    }

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
    if (!ticket || ticket.status !== TicketStatusEnum.OPEN) {
      console.error(`Ticket not found or not open to be removed: ${ticketId}`)
      return
    }

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

"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import sendEmail from "@/components/email/sendEmail"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { generateUserSupportTicketPhotoPathName } from "@/lib/utils"
import { AddSupportTicketEmailTemplate } from "@/components/email/addSupportTicketEmailTemplate"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"

export async function addSupportTicketAction(
  userId: string,
  agencyId: string,
  data: {
    entityType: EntityTypeEnum
    issue: string
    details?: string
    entityId?: string
    photo?: FileList
  },
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  //Add the ticket to the database
  const supportTicket = await supportServices.addSupportTicket({
    userId: currentUser.userId,
    agencyId: currentUser.agencyId,
    entityType: data.entityType,
    entityId: data.entityId,
    issue: data.issue,
    details: data.details,
  })

  if (!supportTicket) {
    return
  }

  //If there is a ticket photo, upload it
  const [ticketPhotoFile] = data.photo || []
  if (ticketPhotoFile) {
    const uploadedTicketPhoto = await uploadFile(
      ticketPhotoFile,
      generateUserSupportTicketPhotoPathName(
        currentUser.userId,
        supportTicket.id,
        ticketPhotoFile,
      ),
    )
    await supportServices.updateSupportTicketPhoto({
      ticketId: supportTicket.id,
      photoUrl: uploadedTicketPhoto.path,
    })
  }

  //Send ticket creation email to support only
  await sendEmail({
    receipientEmail: [SUPPORT_EMAIL],
    subject: "RyoGo Support Ticket Received",
    element: AddSupportTicketEmailTemplate({
      id: supportTicket.id,
      userId: supportTicket.userId,
      agencyId: supportTicket.agencyId,
      issue: supportTicket.issue,
      details: supportTicket.details,
    }),
  })

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.SUPPORT,
    entityId: supportTicket.id,
    textKey: "TicketAdded",
    textObject: {
      ticketId: supportTicket.id,
      userName: currentUser.name,
    },
    link: `/dashboard/support/tickets/${supportTicket.id}`,
  })

  return supportTicket
}

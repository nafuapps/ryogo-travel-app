"use server"

import { AddSupportTicketEmailTemplate } from "@/components/email/addSupportTicketEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { writePermissions } from "@/lib/permissions"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { generateUserSupportTicketPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addSupportTicketAction({
  data,
}: {
  data: {
    userId: string
    agencyId: string
    entityType: EntityTypeEnum
    issue: string
    details?: string
    entityId?: string
    photo?: File
  }
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId: data.agencyId,
    assignedUserId: data.userId,
  })
  if (!currentUser) return

  //Add the ticket to the database
  const newSupportTicket = await supportServices.addSupportTicket({
    userId: currentUser.userId,
    agencyId: currentUser.agencyId,
    entityType: data.entityType,
    entityId: data.entityId,
    issue: data.issue,
    details: data.details,
  })

  if (!newSupportTicket) {
    return
  }

  //If there is a ticket photo, upload it
  const ticketPhotoFile = data.photo
  if (ticketPhotoFile) {
    const uploadedTicketPhoto = await uploadFile(
      ticketPhotoFile,
      generateUserSupportTicketPhotoPathName(
        currentUser.userId,
        newSupportTicket.id,
      ),
    )
    await supportServices.updateSupportTicketPhoto({
      ticketId: newSupportTicket.id,
      photoUrl: uploadedTicketPhoto.path,
    })
  }

  //Send ticket creation email to support only
  await sendEmail({
    receipientEmail: [SUPPORT_EMAIL],
    subject: "RyoGo Support Ticket Received",
    element: AddSupportTicketEmailTemplate({
      id: newSupportTicket.id,
      userId: newSupportTicket.userId,
      agencyId: newSupportTicket.agencyId,
      issue: newSupportTicket.issue,
      details: newSupportTicket.details,
    }),
  })

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.SUPPORT,
    entityId: newSupportTicket.id,
    textKey: "TicketAdded",
    textObject: {
      ticketId: newSupportTicket.id,
      userName: currentUser.name,
    },
    link: `/dashboard/support/tickets/${newSupportTicket.id}`,
  })

  return newSupportTicket
}

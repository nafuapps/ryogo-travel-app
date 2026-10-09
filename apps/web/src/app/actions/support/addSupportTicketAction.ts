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
    photo?: FileList
  }
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== data.userId ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

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
  const [ticketPhotoFile] = data.photo || []
  if (ticketPhotoFile) {
    const uploadedTicketPhoto = await uploadFile(
      ticketPhotoFile,
      generateUserSupportTicketPhotoPathName(
        currentUser.userId,
        newSupportTicket.id,
        ticketPhotoFile,
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

"use server"

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import sendEmail from "@/components/email/sendEmail"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { generateUserSupportTicketPhotoPathName } from "@/lib/utils"
import { AddSupportTicketEmailTemplate } from "@/components/email/addSupportTicketEmailTemplate"

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
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  if (currentUser.userId !== userId || currentUser.agencyId !== agencyId) {
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
  if (data.photo && data.photo[0]) {
    const ticketPhoto = data.photo[0]
    const uploadedTicketPhoto = await uploadFile(
      ticketPhoto,
      generateUserSupportTicketPhotoPathName(
        currentUser.userId,
        supportTicket.id,
        ticketPhoto,
      ),
    )
    await supportServices.updateSupportTicketPhoto(
      supportTicket.id,
      uploadedTicketPhoto.path,
    )
  }

  //Send ticket creation email
  sendEmail(
    [SUPPORT_EMAIL],
    "RyoGo Support Ticket Created",
    AddSupportTicketEmailTemplate({
      id: supportTicket.id,
      userId: supportTicket.userId,
      agencyId: supportTicket.agencyId,
      issue: supportTicket.issue,
      details: supportTicket.details,
    }),
  )

  return supportTicket
}

"use server"

import { writePermissions } from "@/lib/permissions"
import { generateUserSupportTicketPhotoPathName } from "@/lib/utils"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeSupportTicketPhotoAction({
  ticketId,
  userId,
  agencyId,
  photo,
}: {
  ticketId: string
  userId: string
  agencyId: string
  photo: File
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const uploadedPhoto = await uploadFile(
    photo,
    generateUserSupportTicketPhotoPathName(userId, ticketId),
  )
  const photoUrl = uploadedPhoto.path
  const ticket = await supportServices.updateSupportTicketPhoto({
    ticketId,
    photoUrl,
  })

  return ticket
}

"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateUserSupportTicketPhotoPathName } from "@/lib/utils"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeSupportTicketPhotoAction({
  ticketId,
  userId,
  photo,
}: {
  ticketId: string
  userId: string
  photo: File
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.userId !== userId) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

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

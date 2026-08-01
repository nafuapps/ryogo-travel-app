"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateUserSupportTicketPhotoPathName } from "@/lib/utils"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeSupportTicketPhotoAction(
  ticketId: string,
  userId: string,
  photo: FileList,
) {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.userId !== userId || !photo[0]) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const file = photo[0]
  const uploadedPhoto = await uploadFile(
    file,
    generateUserSupportTicketPhotoPathName(userId, ticketId, file),
  )
  const url = uploadedPhoto.path
  const ticket = await supportServices.updateSupportTicketPhoto(ticketId, url)

  return ticket
}

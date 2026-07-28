"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateUserSupportTicketPhotoPathName } from "@/lib/utils"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { redirect, RedirectType } from "next/navigation"

export async function changeSupportTicketPhotoAction(
  ticketId: string,
  userId: string,
  photo: FileList,
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  if (currentUser.userId !== userId || !photo[0]) {
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

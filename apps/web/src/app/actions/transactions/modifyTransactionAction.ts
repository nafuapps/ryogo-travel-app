"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateTransactionPhotoPathName } from "@/lib/utils"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { UpdateTransactionRequestType } from "@ryogo-travel-app/api/types/transaction.types"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyTransactionAction(
  data: UpdateTransactionRequestType,
  agencyId: string,
  assignedUserId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      assignedUserId !== currentUser.userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  //If there is a url for transaction photo, upload it to cloud storage
  if (data.txnPhoto && data.txnPhoto[0]) {
    const file = data.txnPhoto[0]
    const uploadResult = await uploadFile(
      file,
      generateTransactionPhotoPathName(
        data.bookingId,
        data.transactionId,
        file,
      ),
    )
    await transactionServices.changeTransactionPhotoUrl(
      data.transactionId,
      uploadResult.path,
    )
  }

  const updatedTransaction = await transactionServices.modifyTransaction(data)
  return updatedTransaction
}

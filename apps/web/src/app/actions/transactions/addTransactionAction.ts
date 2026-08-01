"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateTransactionPhotoPathName } from "@/lib/utils"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { AddTransactionRequestType } from "@ryogo-travel-app/api/types/transaction.types"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addTransactionAction(data: AddTransactionRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      data.assignedUserId !== currentUser.userId) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const addedTransaction = await transactionServices.addTransaction(data)
  if (!addedTransaction) return

  //If there is a transaction photo, upload it to cloud storage
  if (data.txnPhoto && data.txnPhoto[0]) {
    const file = data.txnPhoto[0]
    const uploadResult = await uploadFile(
      file,
      generateTransactionPhotoPathName(
        data.bookingId,
        addedTransaction.id,
        file,
      ),
    )
    await transactionServices.changeTransactionPhotoUrl(
      addedTransaction.id,
      uploadResult.path,
    )
  }
  return addedTransaction
}

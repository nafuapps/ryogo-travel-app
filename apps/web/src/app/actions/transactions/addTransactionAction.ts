"use server"

import { writePermissions } from "@/lib/permissions"
import { generateTransactionPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { AddTransactionRequestType } from "@ryogo-travel-app/api/types/transaction.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addTransactionAction(data: AddTransactionRequestType) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: data.agencyId,
    assignedUserId: data.assignedUserId,
  })
  if (!currentUser) return

  const addedTransaction = await transactionServices.addTransaction(data)
  if (!addedTransaction) return

  //If there is a transaction photo, upload it to cloud storage
  const file = data.txnPhoto
  if (file) {
    const uploadResult = await uploadFile(
      file,
      generateTransactionPhotoPathName(data.bookingId, addedTransaction.id),
    )
    await transactionServices.changeTransactionPhotoUrl({
      transactionId: addedTransaction.id,
      transactionPhotoUrl: uploadResult.path,
    })
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.TRANSACTION,
    entityId: addedTransaction.id,
    textKey: "TransactionAdded",
    textObject: {
      txnId: addedTransaction.id,
      bookingId: data.bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${data.bookingId}/transactions`,
  })

  return addedTransaction
}

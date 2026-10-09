"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateTransactionPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { UpdateTransactionRequestType } from "@ryogo-travel-app/api/types/transaction.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyTransactionAction({
  data,
}: {
  data: UpdateTransactionRequestType
}) {
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

  let transactionPhotoUrl
  //If there is a transaction photo, upload it to cloud storage
  const [file] = data.txnPhoto || []
  if (file) {
    const uploadResult = await uploadFile(
      file,
      generateTransactionPhotoPathName(
        data.bookingId,
        data.transactionId,
        file,
      ),
    )
    transactionPhotoUrl = uploadResult.path
  }

  const updatedTransaction = await transactionServices.modifyTransaction({
    ...data,
    transactionPhotoUrl,
  })
  if (!updatedTransaction) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.TRANSACTION,
    entityId: updatedTransaction.id,
    textKey: "TransactionModified",
    textObject: {
      txnId: updatedTransaction.id,
      bookingId: updatedTransaction.bookingId,
      userName: currentUser.name,
    },
    link: `/dashboard/bookings/${updatedTransaction.bookingId}/transactions`,
  })

  return updatedTransaction
}

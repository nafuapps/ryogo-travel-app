"use server"

import { generateTransactionPhotoPathName } from "@/lib/utils"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { UpdateTransactionRequestType } from "@ryogo-travel-app/api/types/transaction.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyTransactionAction(
  data: UpdateTransactionRequestType,
) {
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
  if (!updatedTransaction) {
    return false
  }
  return true
}

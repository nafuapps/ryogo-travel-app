"use server"

import { generateTransactionPhotoPathName } from "@/lib/utils"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { AddTransactionRequestType } from "@ryogo-travel-app/api/types/transaction.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addTransactionAction(data: AddTransactionRequestType) {
  const addedTransaction = await transactionServices.addTransaction(data)
  if (!addedTransaction) return false

  //If there is a url for transaction photo, upload it to cloud storage
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
  return true
}

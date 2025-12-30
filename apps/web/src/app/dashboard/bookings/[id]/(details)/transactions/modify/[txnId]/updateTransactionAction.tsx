"use server"

import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { UpdateTransactionRequestType } from "@ryogo-travel-app/api/types/transaction.types"

export async function updateTransactionAction(
  data: UpdateTransactionRequestType
) {
  const updatedTransaction = await transactionServices.modifyTransaction(data)
  if (!updatedTransaction || updatedTransaction.length === 0) {
    return false
  }
  return true
}

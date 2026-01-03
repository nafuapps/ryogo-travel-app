"use server"

import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"

export async function changeTransactionStatusAction(
  txnId: string,
  status: boolean
) {
  const updatedTransaction =
    await transactionServices.modifyTransactionApprovalStatus(txnId, status)
  if (!updatedTransaction || updatedTransaction.length === 0) {
    return false
  }
  return true
}

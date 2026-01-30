"use server"

import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"

export async function changeTransactionApprovalAction(
  txnId: string,
  status: boolean,
) {
  const updatedTransaction =
    await transactionServices.modifyTransactionApprovalStatus(txnId, status)
  if (!updatedTransaction) {
    return false
  }
  return true
}

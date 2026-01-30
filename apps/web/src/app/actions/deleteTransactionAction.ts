"use server"

import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"

export async function deleteTransactionAction(id: string) {
  const deletedTransaction = await transactionServices.removeTransaction(id)
  if (!deletedTransaction) return false
  return true
}

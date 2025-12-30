"use server"

import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { AddTransactionRequestType } from "@ryogo-travel-app/api/types/transaction.types"

export async function addTransactionAction(data: AddTransactionRequestType) {
  const addedTransaction = await transactionServices.addTransaction(data)
  if (!addedTransaction || addedTransaction.length < 1) return false
  return true
}

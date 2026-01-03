"use server"

import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"

export async function changeExpenseStatusAction(
  txnId: string,
  status: boolean
) {
  const updatedExpense = await expenseServices.modifyExpenseApprovalStatus(
    txnId,
    status
  )
  if (!updatedExpense || updatedExpense.length === 0) {
    return false
  }
  return true
}

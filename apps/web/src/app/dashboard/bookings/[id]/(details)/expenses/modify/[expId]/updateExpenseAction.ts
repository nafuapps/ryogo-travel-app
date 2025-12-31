"use server"

import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { UpdateExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"

export async function updateExpenseAction(data: UpdateExpenseRequestType) {
  const updatedExpense = await expenseServices.modifyExpense(data)
  if (!updatedExpense || updatedExpense.length === 0) {
    return false
  }
  return true
}

"use server"

import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { UpdateExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"

export async function modifyRiderExpenseAction(data: UpdateExpenseRequestType) {
  const updatedExpense = await expenseServices.modifyExpense(data)
  if (!updatedExpense) {
    return false
  }
  return true
}

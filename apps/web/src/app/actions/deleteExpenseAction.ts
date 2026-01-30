"use server"

import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"

export async function deleteExpenseAction(id: string) {
  const deletedExpense = await expenseServices.removeExpense(id)
  if (!deletedExpense || deletedExpense.length < 1) return false
  return true
}

"use server"

import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { AddExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"

export async function addRiderExpenseAction(data: AddExpenseRequestType) {
  const addedExpense = await expenseServices.addExpense(data)
  if (!addedExpense) return false
  return true
}

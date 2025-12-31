"use server"

import { expenseServices } from "@ryogo-travel-app/api/services/expense.services"
import { AddExpenseRequestType } from "@ryogo-travel-app/api/types/expense.types"

export async function addExpenseAction(data: AddExpenseRequestType) {
  const addedExpense = await expenseServices.addExpense(data)
  if (!addedExpense || addedExpense.length < 1) return false
  return true
}

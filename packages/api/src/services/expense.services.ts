import { InsertExpenseType } from "@ryogo-travel-app/db/schema"
import { expenseRepository } from "../repositories/expense.repo"
import {
  AddExpenseRequestType,
  UpdateExpenseRequestType,
} from "../types/expense.types"

export const expenseServices = {
  //Add a expense
  async addExpense(data: AddExpenseRequestType) {
    const newExpenseData: InsertExpenseType = {
      bookingId: data.bookingId,
      addedByUserId: data.userId,
      type: data.type,
      amount: data.amount,
      remarks: data.remarks,
      agencyId: data.agencyId,
    }
    const addedExpense = await expenseRepository.createExpense(newExpenseData)
    return addedExpense[0]
  },

  //Modify an expense's details
  async modifyExpense(data: UpdateExpenseRequestType) {
    const updatedExpense = await expenseRepository.updateExpenseDetails(
      data.expenseId,
      data.amount,
      data.type,
      data.remarks,
    )
    return updatedExpense[0]
  },

  //Modify an expense approval status
  async modifyExpenseApprovalStatus(expId: string, status: boolean) {
    const expense = expenseRepository.updateExpenseApprovalStatus(expId, status)
    return expense
  },

  //update expense photo url
  async changeExpensePhotoUrl(expenseId: string, url: string) {
    const expense = await expenseRepository.updateExpensePhotoUrl(
      expenseId,
      url,
    )
    return expense[0]
  },

  //Get expense details by expense id
  async getExpenseDetailsById(expenseId: string) {
    return expenseRepository.readExpenseById(expenseId)
  },

  //Delete a expense
  async removeExpense(expenseId: string) {
    return expenseRepository.deleteExpense(expenseId)
  },
}

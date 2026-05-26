import { InsertExpenseType } from "@ryogo-travel-app/db/schema"
import { expenseRepository } from "../repositories/expense.repo"
import {
  AddExpenseRequestType,
  UpdateExpenseRequestType,
} from "../types/expense.types"

export const expenseServices = {
  //Get expense details by expense id
  async findExpenseDetailsById(expenseId: string) {
    return await expenseRepository.readExpenseById(expenseId)
  },

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
    const expense = await expenseRepository.updateExpenseApprovalStatus(
      expId,
      status,
    )
    return expense[0]
  },

  //update expense photo url
  async changeExpensePhotoUrl(expenseId: string, url: string) {
    await expenseRepository.updateExpensePhotoUrl(expenseId, url)
  },

  //Delete a expense
  async removeExpense(expenseId: string) {
    const expenses = await expenseRepository.deleteExpense(expenseId)
    return expenses[0]
  },
}

export type FindExpenseDetailsByIdType = Awaited<
  ReturnType<typeof expenseServices.findExpenseDetailsById>
>

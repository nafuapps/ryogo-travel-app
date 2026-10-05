import { db } from "@ryogo-travel-app/db"
import { expenses, InsertExpenseType } from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"
import { UpdateExpenseRequestType } from "../types/expense.types"

export const expenseRepository = {
  //Get expenses by booking id
  async readExpensesByBookingId(bookingId: string) {
    return await db.query.expenses.findMany({
      where: eq(expenses.bookingId, bookingId),
      with: {
        addedByUser: {
          columns: {
            id: true,
            name: true,
            photoUrl: true,
            userRole: true,
          },
        },
      },
    })
  },

  //Get expense by expense id
  async readExpenseById(expenseId: string) {
    return await db.query.expenses.findFirst({
      where: eq(expenses.id, expenseId),
    })
  },

  //Create a new expense
  async createExpense(data: InsertExpenseType) {
    return await db.insert(expenses).values(data).returning()
  },

  //Update expense photo URL
  async updateExpensePhotoUrl({
    expenseId,
    expensePhotoUrl,
  }: {
    expenseId: string
    expensePhotoUrl: string
  }) {
    return await db
      .update(expenses)
      .set({ expensePhotoUrl })
      .where(eq(expenses.id, expenseId))
  },

  //Update expense details
  async updateExpenseDetails({
    expenseId,
    amount,
    type,
    expenseDate,
    remarks,
  }: UpdateExpenseRequestType) {
    return await db
      .update(expenses)
      .set({
        amount,
        type,
        expenseDate,
        remarks,
      })
      .where(eq(expenses.id, expenseId))
      .returning()
  },

  //Update expense's approval status
  async updateExpenseApprovalStatus({
    expenseId,
    isApproved,
  }: {
    expenseId: string
    isApproved: boolean
  }) {
    return await db
      .update(expenses)
      .set({ isApproved })
      .where(eq(expenses.id, expenseId))
      .returning()
  },

  //Delete an expense
  async deleteExpense(expenseId: string) {
    return await db
      .delete(expenses)
      .where(eq(expenses.id, expenseId))
      .returning()
  },
}

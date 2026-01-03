import { db } from "@ryogo-travel-app/db"
import {
  expenses,
  ExpenseTypesEnum,
  InsertExpenseType,
} from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"

export const expenseRepository = {
  //Get expenses by booking id
  async readExpensesByBookingId(bookingId: string) {
    return db.query.expenses.findMany({
      where: eq(expenses.bookingId, bookingId),
      with: {
        addedByUser: {
          columns: {
            id: true,
            name: true,
            userRole: true,
          },
        },
      },
    })
  },

  //Get expense by expense id
  async readExpenseById(expenseId: string) {
    return db.query.expenses.findFirst({
      where: eq(expenses.id, expenseId),
    })
  },

  //Create a new expense
  async createExpense(data: InsertExpenseType) {
    return db.insert(expenses).values(data).returning()
  },

  //Update expense photo URL
  async updateExpensePhotoUrl(expenseId: string, photoUrl: string) {
    return db
      .update(expenses)
      .set({ expensePhotoUrl: photoUrl })
      .where(eq(expenses.id, expenseId))
      .returning()
  },

  //Update expense details
  async updateExpenseDetails(
    expenseId: string,
    amount: number,
    type: ExpenseTypesEnum,
    remarks?: string,
    expensePhotoUrl?: string
  ) {
    return db
      .update(expenses)
      .set({
        amount,
        type,
        remarks,
        expensePhotoUrl,
      })
      .where(eq(expenses.id, expenseId))
      .returning()
  },

  //Update expense's approval status
  async updateExpenseApprovalStatus(expenseId: string, status: boolean) {
    return db
      .update(expenses)
      .set({ isApproved: status })
      .where(eq(expenses.id, expenseId))
      .returning()
  },

  //Delete an expense
  async deleteExpense(expenseId: string) {
    return db.delete(expenses).where(eq(expenses.id, expenseId)).returning()
  },
}

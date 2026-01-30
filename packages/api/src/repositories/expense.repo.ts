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

  //Get expenses by user id
  async readExpensesByAddedUserId(userId: string) {
    return db.query.expenses.findMany({
      orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
      limit: 20,
      where: eq(expenses.addedByUserId, userId),
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
  ) {
    return db
      .update(expenses)
      .set({
        amount,
        type,
        remarks,
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

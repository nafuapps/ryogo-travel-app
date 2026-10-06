import { db } from "@ryogo-travel-app/db"
import {
  InsertTransactionType,
  transactions,
} from "@ryogo-travel-app/db/schema"
import { eq, and, gte, lte } from "drizzle-orm"
import { UpdateTransactionRequestType } from "../types/transaction.types"

export const transactionRepository = {
  //Get all transactions within a particular date range
  async readTransactionsByCreatedRange({
    agencyId,
    queryStartDate,
    queryEndDate,
  }: {
    agencyId: string
    queryStartDate: Date
    queryEndDate: Date
  }) {
    return await db.query.transactions.findMany({
      where: and(
        eq(transactions.agencyId, agencyId),
        gte(transactions.createdAt, queryStartDate),
        lte(transactions.createdAt, queryEndDate),
      ),
    })
  },

  //Get transactions by booking id
  async readTransactionsByBookingId(bookingId: string) {
    return await db.query.transactions.findMany({
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
      where: eq(transactions.bookingId, bookingId),
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

  //Get transaction by transaction id
  async readTransactionById(transactionId: string) {
    return await db.query.transactions.findFirst({
      where: eq(transactions.id, transactionId),
    })
  },

  //Get transactions by user id
  async readTransactionsByAddedUserId(userId: string) {
    return await db.query.transactions.findMany({
      where: eq(transactions.addedByUserId, userId),
    })
  },

  //Create a new transaction
  async createTransaction(data: InsertTransactionType) {
    return await db.insert(transactions).values(data).returning()
  },

  //Update transaction photo URL
  async updateTransactionPhotoUrl({
    transactionId,
    transactionPhotoUrl,
  }: {
    transactionId: string
    transactionPhotoUrl: string
  }) {
    return await db
      .update(transactions)
      .set({ transactionPhotoUrl })
      .where(eq(transactions.id, transactionId))
      .returning()
  },

  //Update transaction
  async updateTransactionDetails({
    transactionId,
    amount,
    type,
    mode,
    otherParty,
    transactionDate,
    remarks,
  }: UpdateTransactionRequestType) {
    return await db
      .update(transactions)
      .set({
        amount,
        type,
        mode,
        otherParty,
        transactionDate,
        remarks,
      })
      .where(eq(transactions.id, transactionId))
      .returning()
  },

  //Update transaction's approval status
  async updateTransactionApprovalStatus({
    transactionId,
    isApproved,
  }: {
    transactionId: string
    isApproved: boolean
  }) {
    return await db
      .update(transactions)
      .set({ isApproved })
      .where(eq(transactions.id, transactionId))
      .returning()
  },

  //Delete a transaction
  async deleteTransaction(transactionId: string) {
    return await db
      .delete(transactions)
      .where(eq(transactions.id, transactionId))
      .returning()
  },
}

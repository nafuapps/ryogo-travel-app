import { db } from "@ryogo-travel-app/db"
import {
  InsertTransactionType,
  TransactionModesEnum,
  transactions,
  TransactionsPartiesEnum,
  TransactionTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, and, gte, lte } from "drizzle-orm"

export const transactionRepository = {
  //Get all transactions within a particular date range
  async readTransactionsByCreatedRange(
    agencyId: string,
    startDate: Date,
    endDate: Date
  ) {
    return db
      .select()
      .from(transactions)
      .where(
        and(
          gte(transactions.createdAt, startDate),
          lte(transactions.createdAt, endDate),
          eq(transactions.agencyId, agencyId)
        )
      )
  },

  //Get transactions by booking id
  async readTransactionsByBookingId(bookingId: string) {
    return db.query.transactions.findMany({
      where: eq(transactions.bookingId, bookingId),
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

  //Get transaction by transaction id
  async readTransactionById(txnId: string) {
    return db.query.transactions.findFirst({
      where: eq(transactions.id, txnId),
    })
  },

  //Create a new transaction
  async createTransaction(data: InsertTransactionType) {
    return db.insert(transactions).values(data).returning()
  },

  //Update transaction photo URL
  async updateTransactionPhotoUrl(txnId: string, photoUrl: string) {
    return db
      .update(transactions)
      .set({ transactionPhotoUrl: photoUrl })
      .where(eq(transactions.id, txnId))
      .returning()
  },

  //Update transaction
  async updateTransactionDetails(
    txnId: string,
    amount: number,
    type: TransactionTypesEnum,
    mode: TransactionModesEnum,
    otherParty: TransactionsPartiesEnum,
    remarks?: string,
    transactionPhotoUrl?: string
  ) {
    return db
      .update(transactions)
      .set({
        amount,
        type,
        mode,
        otherParty,
        remarks,
        transactionPhotoUrl,
      })
      .where(eq(transactions.id, txnId))
      .returning()
  },

  //Update transaction's approval status
  async updateTransactionApprovalStatus(txnId: string) {
    return db
      .update(transactions)
      .set({ isApproved: true })
      .where(eq(transactions.id, txnId))
      .returning()
  },

  //Delete a transaction
  async deleteTransaction(txnId: string) {
    return db.delete(transactions).where(eq(transactions.id, txnId)).returning()
  },
}

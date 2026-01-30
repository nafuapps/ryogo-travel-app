import { InsertTransactionType } from "@ryogo-travel-app/db/schema"
import { transactionRepository } from "../repositories/transaction.repo"
import {
  AddTransactionRequestType,
  UpdateTransactionRequestType,
} from "../types/transaction.types"

export const transactionServices = {
  //Get previous N days transactions
  async getTransactionsPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000,
    )
    //Day today
    const endDate = new Date()

    const transactions =
      await transactionRepository.readTransactionsByCreatedRange(
        agencyId,
        startDate,
        endDate,
      )
    return transactions.map((transaction) => {
      return {
        id: transaction.id,
        createdAt: transaction.createdAt,
        type: transaction.type,
        amount: transaction.amount,
      }
    })
  },

  //Add a transaction
  async addTransaction(data: AddTransactionRequestType) {
    const newTransactionData: InsertTransactionType = {
      bookingId: data.bookingId,
      addedByUserId: data.userId,
      type: data.type,
      amount: data.amount,
      mode: data.mode,
      otherParty: data.otherParty,
      remarks: data.remarks,
      agencyId: data.agencyId,
    }
    const addedTransaction =
      await transactionRepository.createTransaction(newTransactionData)

    return addedTransaction[0]
  },

  //Modify a transaction's details
  async modifyTransaction(data: UpdateTransactionRequestType) {
    const updatedTransaction =
      await transactionRepository.updateTransactionDetails(
        data.transactionId,
        data.amount,
        data.type,
        data.mode,
        data.otherParty,
        data.remarks,
      )
    return updatedTransaction[0]
  },

  //Modify a transaction approval status
  async modifyTransactionApprovalStatus(txnId: string, status: boolean) {
    const transaction =
      await transactionRepository.updateTransactionApprovalStatus(txnId, status)
    return transaction[0]
  },

  //Upload transaction photo
  async changeTransactionPhotoUrl(txnId: string, url: string) {
    const txn = await transactionRepository.updateTransactionPhotoUrl(
      txnId,
      url,
    )
    return txn[0]
  },

  //Get transaction details by transaction id
  async getTransactionDetailsById(txnId: string) {
    return await transactionRepository.readTransactionById(txnId)
  },

  //Delete a transaction
  async removeTransaction(txnId: string) {
    const transaction = await transactionRepository.deleteTransaction(txnId)
    return transaction[0]
  },
}

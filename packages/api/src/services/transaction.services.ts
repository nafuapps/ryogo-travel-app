import { InsertTransactionType } from "@ryogo-travel-app/db/schema"
import { transactionRepository } from "../repositories/transaction.repo"
import {
  AddTransactionRequestType,
  UpdateTransactionRequestType,
} from "../types/transaction.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export const transactionServices = {
  //Get previous N days transactions
  async getTransactionsPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000
    )
    //Day today
    const endDate = new Date()

    const transactions =
      await transactionRepository.readTransactionsByCreatedRange(
        agencyId,
        startDate,
        endDate
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
    const addedTransaction = await transactionRepository.createTransaction(
      newTransactionData
    )
    console.log("Added Transaction:", addedTransaction)
    const txnId = addedTransaction[0]?.id

    //If there is a url for txn photo, upload it to cloud storage
    if (data.txnPhoto && data.txnPhoto.length > 0 && txnId) {
      this.uploadTransactionPhoto(txnId, data.txnPhoto[0]!)
    }

    return addedTransaction
  },

  //Modify a transaction's details
  async modifyTransaction(data: UpdateTransactionRequestType) {
    let photoUrl
    //If there is a url for txn photo, upload it to cloud storage
    if (data.txnPhoto && data.txnPhoto.length > 0) {
      photoUrl = await this.uploadTransactionPhoto(
        data.transactionId,
        data.txnPhoto[0]!
      )
    }

    const updatedTransaction = photoUrl
      ? await transactionRepository.updateTransactionDetails(
          data.transactionId,
          data.amount,
          data.type,
          data.mode,
          data.otherParty,
          data.remarks,
          photoUrl
        )
      : await transactionRepository.updateTransactionDetails(
          data.transactionId,
          data.amount,
          data.type,
          data.mode,
          data.otherParty,
          data.remarks
        )
    return updatedTransaction
  },

  //Upload transaction photo
  async uploadTransactionPhoto(txnId: string, file: File) {
    //Name file
    const fileName = `${Date.now()}-${file?.name}`

    // Upload to Supabase Storage
    const uploadResult = await uploadFile(file!, `${txnId}/proof/${fileName}`)

    //Update photoUrl in DB
    const photoUrl = uploadResult!.path
    await transactionRepository.updateTransactionPhotoUrl(txnId, photoUrl)
    return photoUrl
  },

  //Get transaction details by transaction id
  async getTransactionDetailsById(txnId: string) {
    return transactionRepository.readTransactionById(txnId)
  },

  //Delete a transaction
  async removeTransaction(txnId: string) {
    return transactionRepository.deleteTransaction(txnId)
  },
}

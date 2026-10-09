import {
  BookingStatusEnum,
  InsertTransactionType,
} from "@ryogo-travel-app/db/schema"
import { transactionRepository } from "../repositories/transaction.repo"
import {
  AddTransactionRequestType,
  UpdateTransactionRequestType,
} from "../types/transaction.types"
import { subDays } from "date-fns"
import { bookingRepository } from "../repositories/booking.repo"

export const transactionServices = {
  //Get previous N days transactions
  async findTransactionsPreviousDays(agencyId: string, days: number = 1) {
    const queryEndDate = new Date()
    const queryStartDate = subDays(queryEndDate, days)

    const transactions =
      await transactionRepository.readTransactionsByCreatedRange({
        agencyId,
        queryStartDate,
        queryEndDate,
      })
    return transactions.map((transaction) => {
      return {
        id: transaction.id,
        createdAt: transaction.createdAt,
        type: transaction.type,
        amount: transaction.amount,
      }
    })
  },

  //Get transaction details by transaction id
  async findTransactionDetailsById(transactionId: string) {
    const transaction =
      await transactionRepository.readTransactionById(transactionId)
    return transaction
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
      transactionDate: data.transactionDate,
      agencyId: data.agencyId,
      isApproved: data.isApproved,
    }
    const [addedTransaction] =
      await transactionRepository.createTransaction(newTransactionData)

    return addedTransaction
  },

  //Modify a transaction's details
  async modifyTransaction(data: UpdateTransactionRequestType) {
    const booking = await bookingRepository.readBookingStatusById(
      data.bookingId,
    )
    if (
      !booking ||
      ![BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
        booking.status,
      ) ||
      booking.reconciledAt
    ) {
      return
    }

    const [updatedTransaction] =
      await transactionRepository.updateTransactionDetails(data)
    return updatedTransaction
  },

  //Modify a transaction approval status
  async modifyTransactionApprovalStatus({
    transactionId,
    isApproved,
  }: {
    transactionId: string
    isApproved: boolean
  }) {
    const transaction =
      await transactionRepository.readTransactionById(transactionId)
    if (!transaction || transaction.isApproved === isApproved) return

    const booking = await bookingRepository.readBookingStatusById(
      transaction.bookingId,
    )
    if (
      !booking ||
      ![BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
        booking.status,
      ) ||
      booking.reconciledAt
    ) {
      return
    }

    const [updatedTransaction] =
      await transactionRepository.updateTransactionApprovalStatus({
        transactionId,
        isApproved,
      })
    return updatedTransaction
  },

  //Upload transaction photo
  async changeTransactionPhotoUrl({
    transactionId,
    transactionPhotoUrl,
  }: {
    transactionId: string
    transactionPhotoUrl: string
  }) {
    const [updatedTransaction] =
      await transactionRepository.updateTransactionPhotoUrl({
        transactionId,
        transactionPhotoUrl,
      })
    return updatedTransaction
  },

  //Delete a transaction
  async removeTransaction(transactionId: string) {
    const transaction =
      await transactionRepository.readTransactionById(transactionId)
    if (!transaction) return

    const booking = await bookingRepository.readBookingStatusById(
      transaction.bookingId,
    )
    if (
      !booking ||
      ![BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
        booking.status,
      ) ||
      booking.reconciledAt
    ) {
      return
    }

    const [updatedTransaction] =
      await transactionRepository.deleteTransaction(transactionId)
    return updatedTransaction
  },
}

export type FindTransactionsPreviousDaysType = Awaited<
  ReturnType<typeof transactionServices.findTransactionsPreviousDays>
>

export type FindTransactionDetailsByIdType = Awaited<
  ReturnType<typeof transactionServices.findTransactionDetailsById>
>

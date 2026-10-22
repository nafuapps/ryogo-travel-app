import {
  BookingStatusEnum,
  InsertTransactionType,
} from "@ryogo-travel-app/db/schema"
import { subDays } from "date-fns"
import { bookingRepository } from "../repositories/booking.repo"
import { transactionRepository } from "../repositories/transaction.repo"
import {
  AddTransactionRequestType,
  UpdateTransactionRequestType,
} from "../types/transaction.types"

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
    return transactions
  },

  //Get transaction details by transaction id
  async findTransactionDetailsById(transactionId: string) {
    const transaction =
      await transactionRepository.readTransactionById(transactionId)
    return transaction
  },

  //Add a transaction
  async addTransaction(data: AddTransactionRequestType) {
    const booking = await bookingRepository.readBookingStatusById(
      data.bookingId,
    )
    if (
      !booking ||
      [BookingStatusEnum.LEAD, BookingStatusEnum.CANCELLED].includes(
        booking.status,
      ) ||
      booking.reconciledAt
    ) {
      console.error(
        `Booking not found, is lead or cancelled or already reconciled: ${data.bookingId}`,
      )
      return
    }
    const newTransactionData: InsertTransactionType = {
      bookingId: data.bookingId,
      addedByUserId: data.userId,
      type: data.type,
      amount: data.amount,
      mode: data.mode,
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
      [BookingStatusEnum.LEAD, BookingStatusEnum.CANCELLED].includes(
        booking.status,
      ) ||
      booking.reconciledAt
    ) {
      console.error(
        `Booking not found, is lead or cancelled or already reconciled: ${data.bookingId} ${data.transactionId}`,
      )
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
    if (!transaction || transaction.isApproved === isApproved) {
      console.error(
        `Transaction not found or already has the same approval status: ${transactionId} ${isApproved}`,
      )
      return
    }

    const booking = await bookingRepository.readBookingStatusById(
      transaction.bookingId,
    )
    if (
      !booking ||
      [BookingStatusEnum.LEAD, BookingStatusEnum.CANCELLED].includes(
        booking.status,
      ) ||
      booking.reconciledAt
    ) {
      console.error(
        `Booking not found, is lead or cancelled or already reconciled: ${transaction.bookingId} ${transactionId}`,
      )
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
    if (!transaction) {
      console.error(`Transaction not found: ${transactionId}`)

      return
    }

    const booking = await bookingRepository.readBookingStatusById(
      transaction.bookingId,
    )
    if (
      !booking ||
      [BookingStatusEnum.LEAD, BookingStatusEnum.CANCELLED].includes(
        booking.status,
      ) ||
      booking.reconciledAt
    ) {
      console.error(
        `Booking not found, is lead or cancelled or already reconciled: ${transaction.bookingId} ${transactionId}`,
      )
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

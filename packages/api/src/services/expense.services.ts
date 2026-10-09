import {
  BookingStatusEnum,
  InsertExpenseType,
} from "@ryogo-travel-app/db/schema"
import { expenseRepository } from "../repositories/expense.repo"
import {
  AddExpenseRequestType,
  UpdateExpenseRequestType,
} from "../types/expense.types"
import { bookingRepository } from "../repositories/booking.repo"

export const expenseServices = {
  //Get expense details by expense id
  async findExpenseDetailsById(expenseId: string) {
    const expense = await expenseRepository.readExpenseById(expenseId)
    return expense
  },

  //Add a expense
  async addExpense(data: AddExpenseRequestType) {
    const newExpenseData: InsertExpenseType = {
      bookingId: data.bookingId,
      addedByUserId: data.userId,
      type: data.type,
      amount: data.amount,
      remarks: data.remarks,
      isApproved: data.isApproved,
      expenseDate: data.expenseDate,
      agencyId: data.agencyId,
    }
    const [addedExpense] = await expenseRepository.createExpense(newExpenseData)
    return addedExpense
  },

  //Modify an expense's details
  async modifyExpense(data: UpdateExpenseRequestType) {
    const booking = await bookingRepository.readBookingStatusById(
      data.bookingId,
    )
    if (
      !booking ||
      ![BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
        booking.status,
      ) ||
      booking.closedAt
    ) {
      return
    }

    const [updatedExpense] = await expenseRepository.updateExpenseDetails(data)
    return updatedExpense
  },

  //Modify an expense approval status
  async modifyExpenseApprovalStatus({
    expenseId,
    isApproved,
  }: {
    expenseId: string
    isApproved: boolean
  }) {
    const expense = await expenseRepository.readExpenseById(expenseId)
    if (!expense || expense.isApproved === isApproved) return

    const booking = await bookingRepository.readBookingStatusById(
      expense.bookingId,
    )
    if (
      !booking ||
      ![BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
        booking.status,
      ) ||
      booking.closedAt
    ) {
      return
    }

    const [updatedExpense] =
      await expenseRepository.updateExpenseApprovalStatus({
        expenseId,
        isApproved,
      })
    return updatedExpense
  },

  //update expense photo url
  async changeExpensePhotoUrl({
    expenseId,
    expensePhotoUrl,
  }: {
    expenseId: string
    expensePhotoUrl: string
  }) {
    await expenseRepository.updateExpensePhotoUrl({
      expenseId,
      expensePhotoUrl,
    })
  },

  //Delete a expense
  async removeExpense(expenseId: string) {
    const expense = await expenseRepository.readExpenseById(expenseId)
    if (!expense) return

    const booking = await bookingRepository.readBookingStatusById(
      expense.bookingId,
    )
    if (
      !booking ||
      ![BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
        booking.status,
      ) ||
      booking.closedAt
    ) {
      return
    }

    const [deletedExpense] = await expenseRepository.deleteExpense(expenseId)
    return deletedExpense
  },
}

export type FindExpenseDetailsByIdType = Awaited<
  ReturnType<typeof expenseServices.findExpenseDetailsById>
>

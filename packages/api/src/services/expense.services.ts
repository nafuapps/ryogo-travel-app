import {
  BookingStatusEnum,
  InsertExpenseType,
} from "@ryogo-travel-app/db/schema"
import { bookingRepository } from "../repositories/booking.repo"
import { expenseRepository } from "../repositories/expense.repo"
import {
  AddExpenseRequestType,
  UpdateExpenseRequestType,
} from "../types/expense.types"

export const expenseServices = {
  //Get expense details by expense id
  async findExpenseDetailsById(expenseId: string) {
    const expense = await expenseRepository.readExpenseById(expenseId)
    return expense
  },

  //Add a expense
  async addExpense(data: AddExpenseRequestType) {
    const booking = await bookingRepository.readBookingStatusById(
      data.bookingId,
    )
    if (
      !booking ||
      [BookingStatusEnum.LEAD, BookingStatusEnum.CANCELLED].includes(
        booking.status,
      ) ||
      booking.closedAt
    ) {
      console.error(
        `Booking not found, is lead or cancelled or already closed: ${data.bookingId}`,
      )
      return
    }
    const newExpenseData: InsertExpenseType = {
      bookingId: data.bookingId,
      addedByUserId: data.userId,
      type: data.type,
      amount: data.amount,
      remarks: data.remarks,
      isPaidByDriver: data.isPaidByDriver,
      isApproved: data.isApproved,
      expenseDate: data.expenseDate,
      agencyId: data.agencyId,
    }
    const [addedExpense] = await expenseRepository.createExpense(newExpenseData)
    if (!addedExpense) {
      console.error(`Expense could not be added: ${data}`)
      return
    }
    return addedExpense
  },

  //Modify an expense's details
  async modifyExpense(data: UpdateExpenseRequestType) {
    const booking = await bookingRepository.readBookingStatusById(
      data.bookingId,
    )
    if (
      !booking ||
      [BookingStatusEnum.LEAD, BookingStatusEnum.CANCELLED].includes(
        booking.status,
      ) ||
      booking.closedAt
    ) {
      console.error(
        `Booking not found, is lead or cancelled or already closed: ${data.bookingId}`,
      )
      return
    }

    const [updatedExpense] = await expenseRepository.updateExpenseDetails(data)
    if (!updatedExpense) {
      console.error(`Expense could not be modified: ${data}`)
      return
    }
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
    if (!expense || expense.isApproved === isApproved) {
      console.error(
        `Expense not found or already has the same approval status: ${expenseId} ${isApproved}`,
      )
      return
    }

    const booking = await bookingRepository.readBookingStatusById(
      expense.bookingId,
    )
    if (
      !booking ||
      [BookingStatusEnum.LEAD, BookingStatusEnum.CANCELLED].includes(
        booking.status,
      ) ||
      booking.closedAt
    ) {
      console.error(
        `Booking not found, is lead or cancelled or already closed: ${expense.bookingId}`,
      )
      return
    }

    const [updatedExpense] =
      await expenseRepository.updateExpenseApprovalStatus({
        expenseId,
        isApproved,
      })
    if (!updatedExpense) {
      console.error(
        `Expense approval status could not be updated: ${expenseId} ${isApproved}`,
      )
      return
    }
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
    if (!expense) {
      console.error(`Expense not found: ${expenseId}`)
      return
    }

    const booking = await bookingRepository.readBookingStatusById(
      expense.bookingId,
    )
    if (
      !booking ||
      [BookingStatusEnum.LEAD, BookingStatusEnum.CANCELLED].includes(
        booking.status,
      ) ||
      booking.closedAt
    ) {
      console.error(
        `Booking not found, is lead or cancelled or already closed: ${expense.bookingId}`,
      )
      return
    }

    const [deletedExpense] = await expenseRepository.deleteExpense(expenseId)
    if (!deletedExpense) {
      console.error(`Expense could not be removed: ${expenseId}`)
      return
    }
    return deletedExpense
  },
}

export type FindExpenseDetailsByIdType = Awaited<
  ReturnType<typeof expenseServices.findExpenseDetailsById>
>

import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"

export type AddExpenseRequestType = {
  agencyId: string
  bookingId: string
  userId: string
  assignedUserId: string
  type: ExpenseTypesEnum
  amount: number
  expenseDate: Date
  isPaidByDriver: boolean
  isApproved?: boolean
  remarks?: string
  expensePhoto?: File
}

export type UpdateExpenseRequestType = {
  expenseId: string
  bookingId: string
  type: ExpenseTypesEnum
  amount: number
  expenseDate: Date
  isPaidByDriver: boolean
  remarks?: string
  expensePhoto?: File
  expensePhotoUrl?: string
}

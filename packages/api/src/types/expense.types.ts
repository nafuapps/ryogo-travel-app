import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"

export type AddExpenseRequestType = {
  agencyId: string
  bookingId: string
  userId: string
  assignedUserId: string
  type: ExpenseTypesEnum
  amount: number
  expenseDate: Date
  isApproved?: boolean
  remarks?: string | undefined
  expensePhoto?: FileList | undefined
}

export type UpdateExpenseRequestType = {
  expenseId: string
  bookingId: string
  type: ExpenseTypesEnum
  amount: number
  expenseDate: Date
  remarks?: string | undefined
  expensePhoto?: FileList | undefined
  expensePhotoUrl?: string
}

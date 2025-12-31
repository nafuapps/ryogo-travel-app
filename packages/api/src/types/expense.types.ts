import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"

export type AddExpenseRequestType = {
  agencyId: string
  bookingId: string
  userId: string
  type: ExpenseTypesEnum
  amount: number
  remarks?: string | undefined
  expensePhoto?: FileList | undefined
}

export type UpdateExpenseRequestType = {
  expenseId: string
  type: ExpenseTypesEnum
  amount: number
  remarks?: string | undefined
  expensePhoto?: FileList | undefined
}

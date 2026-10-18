import {
  TransactionModesEnum,
  TransactionTypesEnum,
} from "@ryogo-travel-app/db/schema"

export type AddTransactionRequestType = {
  agencyId: string
  bookingId: string
  userId: string
  assignedUserId: string
  type: TransactionTypesEnum
  amount: number
  mode: TransactionModesEnum
  transactionDate: Date
  isApproved?: boolean
  remarks?: string
  txnPhoto?: File
}

export type UpdateTransactionRequestType = {
  agencyId: string
  assignedUserId: string
  transactionId: string
  bookingId: string
  type: TransactionTypesEnum
  amount: number
  mode: TransactionModesEnum
  isApproved: boolean
  transactionDate: Date
  remarks?: string
  txnPhoto?: File
  transactionPhotoUrl?: string
}

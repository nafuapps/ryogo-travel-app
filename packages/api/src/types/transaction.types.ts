import {
  TransactionModesEnum,
  TransactionTypesEnum,
  TransactionPartiesEnum,
} from "@ryogo-travel-app/db/schema"

export type AddTransactionRequestType = {
  agencyId: string
  bookingId: string
  userId: string
  assignedUserId: string
  type: TransactionTypesEnum
  amount: number
  mode: TransactionModesEnum
  otherParty: TransactionPartiesEnum
  transactionDate: Date
  isApproved?: boolean
  remarks?: string | undefined
  txnPhoto?: FileList | undefined
}

export type UpdateTransactionRequestType = {
  agencyId: string
  assignedUserId: string
  transactionId: string
  bookingId: string
  type: TransactionTypesEnum
  amount: number
  mode: TransactionModesEnum
  otherParty: TransactionPartiesEnum
  transactionDate: Date
  remarks?: string | undefined
  txnPhoto?: FileList | undefined
  transactionPhotoUrl?: string
}

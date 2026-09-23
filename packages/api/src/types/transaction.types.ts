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
  remarks?: string | undefined
  txnPhoto?: FileList | undefined
}

export type UpdateTransactionRequestType = {
  transactionId: string
  bookingId: string
  type: TransactionTypesEnum
  amount: number
  mode: TransactionModesEnum
  otherParty: TransactionPartiesEnum
  remarks?: string | undefined
  txnPhoto?: FileList | undefined
}

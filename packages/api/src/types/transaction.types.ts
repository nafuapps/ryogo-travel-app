import {
  TransactionModesEnum,
  TransactionTypesEnum,
  TransactionsPartiesEnum,
} from "@ryogo-travel-app/db/schema"

export type AddTransactionRequestType = {
  agencyId: string
  bookingId: string
  userId: string
  type: TransactionTypesEnum
  amount: number
  mode: TransactionModesEnum
  otherParty: TransactionsPartiesEnum
  remarks?: string | undefined
  txnPhoto?: FileList | undefined
}

export type UpdateTransactionRequestType = {
  transactionId: string
  bookingId: string
  type: TransactionTypesEnum
  amount: number
  mode: TransactionModesEnum
  otherParty: TransactionsPartiesEnum
  remarks?: string | undefined
  txnPhoto?: FileList | undefined
}

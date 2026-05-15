import {
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@ryogo-travel-app/db/schema"

export type UpdatePaymentDetailsType = {
  amount?: number
  status?: PaymentStatusEnum
  method?: PaymentMethodEnum
  bankName?: string
  cardId?: string
  vpa?: string
  wallet?: string
  email?: string
  contact?: string
  rpFee?: number
  tax?: number
  errorCode?: string
  errorDesc?: string
  errorReason?: string
  errorSource?: string
  errorStep?: string
  events?: string[]
}

import {
  InsertPaymentType,
  PaymentStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { paymentRepository } from "../repositories/payment.repo"
import { UpdatePaymentDetailsType } from "../types/payment.types"

export const paymentServices = {
  async findAllPaymentsByOrderId(orderId: string) {
    return await paymentRepository.readAllPaymentsByOrderId(orderId)
  },
  async findAllPaymentsByUserId(userId: string) {
    return await paymentRepository.readAllPaymentsByUserId(userId)
  },
  async findAllPaymentsByAgencyId(agencyId: string) {
    return await paymentRepository.readAllPaymentsByAgencyId(agencyId)
  },

  async findPaymentByRPId(rpPaymentId: string) {
    return await paymentRepository.readPaymentByRPId(rpPaymentId)
  },

  async addPayment(newPayment: InsertPaymentType) {
    const addedPayment = await paymentRepository.createPayment(newPayment)
    if (!addedPayment || addedPayment.length < 1) return
    return addedPayment[0]
  },

  async changePaymentDetailsByRPId(
    rpId: string,
    data: UpdatePaymentDetailsType,
  ) {
    const updatedPayment = await paymentRepository.updatePaymentDetailsByRpId(
      rpId,
      data,
    )
    return updatedPayment[0]
  },
}

export type FindAllPaymentsByOrderIdType = Awaited<
  ReturnType<typeof paymentServices.findAllPaymentsByOrderId>
>
export type FindAllPaymentsByUserIdType = Awaited<
  ReturnType<typeof paymentServices.findAllPaymentsByUserId>
>
export type FindAllPaymentsByAgencyIdType = Awaited<
  ReturnType<typeof paymentServices.findAllPaymentsByAgencyId>
>
export type FindPaymentByRPIdType = Awaited<
  ReturnType<typeof paymentServices.findPaymentByRPId>
>

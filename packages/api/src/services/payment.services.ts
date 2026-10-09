import { InsertPaymentType } from "@ryogo-travel-app/db/schema"
import { paymentRepository } from "../repositories/payment.repo"
import { UpdatePaymentDetailsType } from "../types/payment.types"

export const paymentServices = {
  async findAllPaymentsByOrderId(orderId: string) {
    const payments = await paymentRepository.readAllPaymentsByOrderId(orderId)
    return payments
  },
  async findAllPaymentsByUserId(userId: string) {
    const payments = await paymentRepository.readAllPaymentsByUserId(userId)
    return payments
  },
  async findAllPaymentsByAgencyId(agencyId: string) {
    const payments = await paymentRepository.readAllPaymentsByAgencyId(agencyId)
    return payments
  },

  async findPaymentByRPId(rpPaymentId: string) {
    const payment = await paymentRepository.readPaymentByRPId(rpPaymentId)
    return payment
  },

  async addPayment(newPayment: InsertPaymentType) {
    const [addedPayment] = await paymentRepository.createPayment(newPayment)
    return addedPayment
  },

  async changePaymentDetailsByRPId(data: UpdatePaymentDetailsType) {
    const [updatedPayment] =
      await paymentRepository.updatePaymentDetailsByRpId(data)
    return updatedPayment
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

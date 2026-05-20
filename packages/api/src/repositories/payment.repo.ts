import { db } from "@ryogo-travel-app/db"
import { InsertPaymentType, payments } from "@ryogo-travel-app/db/schema"
import { eq } from "drizzle-orm"
import { UpdatePaymentDetailsType } from "../types/payment.types"

export const paymentRepository = {
  async readPaymentByRPId(rpPaymentId: string) {
    return await db.query.payments.findFirst({
      where: eq(payments.rpPaymentId, rpPaymentId),
    })
  },

  async readAllPaymentsByOrderId(orderId: string) {
    return await db.query.payments.findMany({
      where: eq(payments.orderId, orderId),
    })
  },

  async readAllPaymentsByUserId(userId: string) {
    return await db.query.payments.findMany({
      where: eq(payments.userId, userId),
    })
  },

  async readAllPaymentsByAgencyId(agencyId: string) {
    return await db.query.payments.findMany({
      where: eq(payments.agencyId, agencyId),
      with: {
        order: {
          columns: {
            status: true,
          },
        },
      },
    })
  },

  async createPayment(payment: InsertPaymentType) {
    return await db.insert(payments).values(payment).returning()
  },

  async updatePaymentDetailsByRpId(
    rpPaymentId: string,
    paymentDetails: UpdatePaymentDetailsType,
  ) {
    return await db
      .update(payments)
      .set({
        ...paymentDetails,
      })
      .where(eq(payments.rpPaymentId, rpPaymentId))
      .returning()
  },
}

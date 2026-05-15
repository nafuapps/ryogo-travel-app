"use server"

import generateAndsendInvoiceEmail from "@/components/email/generateAndsendInvoiceEmail"
import { getCurrentUser } from "@/lib/auth"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import crypto from "crypto"

export async function verifyOrderAction({
  rpOrderId,
  rpPaymentId,
  rpSignature,
  agencyId,
  userId,
}: {
  rpOrderId: string
  rpPaymentId: string
  rpSignature: string
  agencyId: string
  userId: string
}) {
  if (!rpOrderId || !rpPaymentId || !rpSignature) {
    throw new Error("Payment verification failed: Missing required parameters")
  }

  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    throw new Error("User verification failed")
  }

  // 1. Generate the expected signature
  const secret = process.env.RAZORPAY_TEST_KEY_SECRET!
  //   const secret = process.env.RAZORPAY_LIVE_KEY_SECRET!
  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(rpOrderId + "|" + rpPaymentId)
    .digest("hex")

  // 2. Compare signatures
  if (generated_signature !== rpSignature) {
    throw new Error("Payment verification failed: Invalid signature")
  }

  // 3. Update the Database
  const updatedRecord = await orderServices.changeOrderToPaid(rpOrderId, false)
  if (!updatedRecord) return //Handle failed DB update on the client

  // 4. Send invoice to user
  generateAndsendInvoiceEmail(rpOrderId, agencyId, userId)

  return updatedRecord
}

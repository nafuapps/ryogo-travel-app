"use server"

import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"
import crypto from "crypto"

export async function verifyOrderAction({
  rpOrderId,
  rpPaymentId,
  rpSignature,
  agencyId,
}: {
  rpOrderId: string
  rpPaymentId: string
  rpSignature: string
  agencyId: string
}) {
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

  // 3. Update the Database (Atomic update using Drizzle)
  try {
    const updatedRecord = await orderServices.changeOrderToPaid(rpOrderId)
    if (updatedRecord) {
      await agencyServices.subscribeAgency(agencyId, updatedRecord.orderType)
    }
    return updatedRecord
  } catch (error) {
    console.error("Database update failed:", error)
    throw new Error("Payment verified but database update failed.")
  }
}

"use server"

import Razorpay from "razorpay"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID!,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
  // key_id: process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID!,
  // key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET!,
})

export async function createOrderAction(agencyId: string, amountInRs: number) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.userRole !== UserRolesEnum.OWNER) {
    return
  }

  const options = {
    amount: amountInRs * 100, // Razorpay works in paise
    currency: "INR",
    receipt: `ryogo_receipt_${Date.now()}`,
  }

  const rpOrder = await razorpay.orders.create(options)

  const newOrder = await orderServices.addOrder(
    agencyId,
    currentUser.userId,
    amountInRs,
    rpOrder.id,
  )

  return newOrder
}

"use server"

import Razorpay from "razorpay"
import { getCurrentUser } from "@/lib/auth"
import { OrderTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"

const razorpay = new Razorpay({
  key_id:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID!
      : process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID!,
  key_secret:
    process.env.NODE_ENV === "production"
      ? process.env.RAZORPAY_LIVE_KEY_SECRET!
      : process.env.RAZORPAY_TEST_KEY_SECRET!,
})

export async function createOrderAction(
  agencyId: string,
  userId: string,
  plan: OrderTypeEnum,
) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.userRole !== UserRolesEnum.OWNER) {
    return
  }

  const amountInRs = orderServices.getAmountByPlan(plan)

  //If an order already exists by this user for this plan in last X hours, use it for payment
  const existingOrder = await orderServices.findExistingCreatedOrder(
    agencyId,
    userId,
    plan,
  )
  if (existingOrder) {
    return existingOrder
  }

  //Create Razorpay Order
  const rpOrder = await razorpay.orders.create({
    amount: amountInRs * 100, // Razorpay works in paise
    currency: "INR",
    receipt: `ryogo_receipt_${Date.now()}`,
    notes: {
      agencyId: agencyId,
      plan: plan,
      userId: userId,
      userName: currentUser.name,
    },
  })

  //Store order in DB
  const newOrder = await orderServices.addOrder(
    agencyId,
    currentUser.userId,
    amountInRs,
    rpOrder.id,
  )

  return newOrder
}

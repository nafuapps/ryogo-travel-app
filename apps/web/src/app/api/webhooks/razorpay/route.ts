import { NextResponse } from "next/server"
import crypto from "crypto"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("x-razorpay-signature")

  // Verify Webhook Signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_TEST_WEBHOOK_SECRET!)
    // .createHmac("sha256", process.env.RAZORPAY_LIVE_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex")

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === "order.paid") {
    const { order_id } = event.payload.payment.entity

    // 1. Update Payment Status
    const updatedRecord = await orderServices.changeOrderToPaid(order_id)

    // 2. Upgrade Agency Tier
    if (updatedRecord) {
      await agencyServices.subscribeAgency(
        updatedRecord.agencyId,
        updatedRecord.orderType,
      )
    }
  }

  return NextResponse.json({ received: true })
}

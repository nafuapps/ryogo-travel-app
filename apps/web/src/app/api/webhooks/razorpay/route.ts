import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"
import { paymentServices } from "@ryogo-travel-app/api/services/payment.services"
import {
  EntityTypeEnum,
  OrderStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@ryogo-travel-app/db/schema"
import generateAndsendInvoiceEmail from "@/components/email/generateAndsendInvoiceEmail"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { addDays } from "date-fns"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("x-razorpay-signature")

  const secret =
    process.env.NODE_ENV === "production"
      ? process.env.RAZORPAY_LIVE_WEBHOOK_SECRET!
      : process.env.RAZORPAY_TEST_WEBHOOK_SECRET!

  // Verify Webhook Signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex")

  if (expectedSignature !== signature) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    )
  }

  const event = JSON.parse(body)
  const paymentEntity = event.payload.payment.entity

  //Find order in DB
  const orderInDB = await orderServices.findOrderByRPId(paymentEntity.order_id)

  //Order not found, big error
  if (!orderInDB) {
    return NextResponse.json(
      { error: "Order Id not found in DB" },
      { status: 400 },
    )
  }

  //For order already paid in DB..
  if (orderInDB.status === OrderStatusEnum.PAID) {
    if (orderInDB.isWebhookConfirmed) {
      //If webhook is already confirmed, leave - nothing to do here
      return NextResponse.json({ received: true })
    }
    //Else, update order webhook status
    await orderServices.confirmOrderWebhookStatus(orderInDB.id)
  }

  //Find payment in DB
  const paymentInDB = await paymentServices.findPaymentByRPId(paymentEntity.id)

  //If payment is already captured in DB, leave - nothing to do here
  if (
    orderInDB.status === OrderStatusEnum.PAID &&
    paymentInDB?.status === PaymentStatusEnum.CAPTURED
  ) {
    return NextResponse.json({ received: true })
  }

  //If no payment found in DB, log it
  if (!paymentInDB) {
    await paymentServices.addPayment({
      orderId: orderInDB.id,
      agencyId: orderInDB.agencyId,
      userId: orderInDB.userId,
      rpPaymentId: paymentEntity.id,
      amount: paymentEntity.amount / 100, //Store amount in Rs
      status: getPaymentStatus(event.event),
      method: getPaymentMethod(paymentEntity.method),
      bankName: paymentEntity.bank,
      cardId: paymentEntity.card
        ? paymentEntity.card.last4 + "-" + paymentEntity.card.network
        : undefined,
      vpa: paymentEntity.vpa,
      wallet: paymentEntity.wallet,
      email: paymentEntity.email,
      contact: paymentEntity.contact,
      rpFee: paymentEntity.fee,
      tax: paymentEntity.tax,
      errorCode: paymentEntity.error_code,
      errorDesc: paymentEntity.error_description,
      errorReason: paymentEntity.error_reason,
      errorSource: paymentEntity.error_source,
      errorStep: paymentEntity.error_step,
      events: [event.event],
    })
  } else {
    //Else update it
    await paymentServices.changePaymentDetailsByRPId(paymentEntity.id, {
      amount: paymentEntity.amount / 100, //Store amount in Rs
      status: getPaymentStatus(event.event),
      method: getPaymentMethod(paymentEntity.method),
      bankName: paymentEntity.bank,
      cardId: paymentEntity.card
        ? paymentEntity.card.last4 + "-" + paymentEntity.card.network
        : undefined,
      vpa: paymentEntity.vpa,
      wallet: paymentEntity.wallet,
      email: paymentEntity.email,
      contact: paymentEntity.contact,
      rpFee: paymentEntity.fee,
      tax: paymentEntity.tax,
      errorCode: paymentEntity.error_code,
      errorDesc: paymentEntity.error_description,
      errorSource: paymentEntity.error_source,
      errorStep: paymentEntity.error_step,
      errorReason: paymentEntity.error_reason,
      events: [...paymentInDB.events, event.event],
    })
  }

  //Already paid order in DB, leave now - nothing else to do here
  if (orderInDB.status === OrderStatusEnum.PAID) {
    return NextResponse.json({ received: true })
  }

  //If order event is 'paid'
  if (event.event === "order.paid") {
    const attempts = event.payload.order.entity.attempts
    //Mark order as paid in DB - this will trigger subscription upgrade
    const updatedOrder = await orderServices.changeOrderToPaid(
      paymentEntity.order_id,
      true,
      attempts,
    )
    if (updatedOrder) {
      const userName = event.payload.order.entity.notes.userName
      await notificationServices.addNotification({
        agencyId: updatedOrder.agencyId,
        entityType: EntityTypeEnum.ORDER,
        entityId: updatedOrder.id,
        isFeed: true,
        textKey: "SubscriptionPurchased",
        textObject: {
          plan: updatedOrder.orderType.toUpperCase(),
          userName: userName ?? "Owner",
        },
        link: `/dashboard/account/agency`,
      })

      generateAndsendInvoiceEmail(
        paymentEntity.order_id,
        updatedOrder.agencyId,
        updatedOrder.userId,
      )
    }
    return NextResponse.json({ received: true })
  }

  //If payment event is 'authorized' or 'failed' or 'captured'
  if (
    event.event === "payment.captured" ||
    event.event === "payment.authorized" ||
    event.event === "payment.failed"
  ) {
    //Update 'created' order status to 'attempted'
    if (orderInDB.status === OrderStatusEnum.CREATED) {
      await orderServices.changeOrderToAttempted(paymentEntity.order_id)
    }
    if (event.event === "payment.failed") {
      await missionServices.addMission({
        agencyId: orderInDB.agencyId,
        userId: orderInDB.userId,
        entityType: EntityTypeEnum.ORDER,
        entityId: orderInDB.id,
        isCritical: true,
        dueDate: addDays(new Date(), 3),
        titleKey: "SubscriptionPaymentFailed.Title",
        titleObject: {
          plan: orderInDB.orderType.toUpperCase(),
          orderId: orderInDB.id,
        },
        messageKey: "SubscriptionPaymentFailed.Message",
        link: `/dashboard/account/subscription`,
      })
    }
    return NextResponse.json({ received: true })
  }

  //Unknown event
  return NextResponse.json({ error: "Unknown event" }, { status: 400 })
}

function getPaymentMethod(method: string) {
  if (method === "netbanking") return PaymentMethodEnum.NET_BANKING
  if (method === "card") return PaymentMethodEnum.CARD
  if (method === "upi") return PaymentMethodEnum.UPI
  if (method === "wallet") return PaymentMethodEnum.WALLET
  return PaymentMethodEnum.OTHER
}

function getPaymentStatus(event: string) {
  if (event === "payment.authorized") return PaymentStatusEnum.AUTHORIZED
  if (event === "payment.failed") return PaymentStatusEnum.FAILED
  if (event === "payment.captured") return PaymentStatusEnum.CAPTURED
  if (event === "order.paid") return PaymentStatusEnum.CAPTURED
  return PaymentStatusEnum.CREATED
}

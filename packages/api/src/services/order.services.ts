import {
  InsertOrderType,
  OrderStatusEnum,
  OrderTypeEnum,
  SubscriptionPlanEnum,
} from "@ryogo-travel-app/db/schema"
import { orderRepository } from "../repositories/order.repo"
import {
  ANNUAL_SUBSCRIPTION_DAYS,
  EXISTING_ORDER_SEARCH_HOURS,
  MONTHLY_SUBSCRIPTION_DAYS,
  QUARTERLY_SUBSCRIPTION_DAYS,
} from "../apiConfig"
import { agencyRepository } from "../repositories/agency.repo"
import { addDays, max } from "date-fns"

export const orderServices = {
  async findAllOrdersByAgencyId(agencyId: string) {
    return await orderRepository.readAllOrdersByAgencyId(agencyId)
  },
  async findAllOrdersByUserId(userId: string) {
    return await orderRepository.readAllOrdersByUserId(userId)
  },

  async findOrderByRPId(rpOrderId: string) {
    return await orderRepository.readOrderByRPId(rpOrderId)
  },

  async findLastPaidOrder(agencyId: string) {
    return await orderRepository.readAgencyLatestOrderByStatus({
      agencyId,
      status: OrderStatusEnum.PAID,
    })
  },

  async findExistingCreatedOrder({
    agencyId,
    userId,
    orderType,
  }: {
    agencyId: string
    userId: string
    orderType: OrderTypeEnum
  }) {
    const existingOrder = await orderRepository.readOrderCreatedRange({
      agencyId,
      userId,
      orderType,
      hours: EXISTING_ORDER_SEARCH_HOURS,
    })
    return existingOrder
  },

  async addOrder(data: InsertOrderType) {
    const [order] = await orderRepository.createOrder({
      agencyId: data.agencyId,
      userId: data.userId,
      amount: data.amount,
      rpOrderId: data.rpOrderId,
      status: OrderStatusEnum.CREATED,
    })
    return order
  },

  async changeOrderToAttempted(rpOrderId: string) {
    const [order] = await orderRepository.updateOrderStatusbyRPId({
      rpOrderId,
      status: OrderStatusEnum.ATTEMPTED,
      isWebhookConfirmed: false,
    })
    return order
  },

  async changeOrderToPaid({
    rpOrderId,
    isWebhookConfirmed,
    attempts,
  }: {
    rpOrderId: string
    isWebhookConfirmed: boolean
    attempts?: number
  }) {
    const orderDetails = await orderRepository.readOrderByRPId(rpOrderId)
    if (!orderDetails) return
    const agencyDetails = await agencyRepository.readAgencyById(
      orderDetails.agencyId,
    )
    if (!agencyDetails) return

    //If already paid and confirmed, do nothing
    if (
      orderDetails.status === OrderStatusEnum.PAID &&
      orderDetails.isWebhookConfirmed
    )
      return

    //Update order in DB
    const [updatedOrder] = await orderRepository.updateOrderStatusbyRPId({
      rpOrderId,
      status: OrderStatusEnum.PAID,
      isWebhookConfirmed,
      attempts,
    })
    // If for some reason, order update failed, should we proceed with subscription upgrade? -> NO
    if (!updatedOrder) return

    //If it was already paid, return now
    if (orderDetails.status === OrderStatusEnum.PAID) return

    //Trigger subscription upgrade
    const orderSubscriptionDays = getSubscriptionDays(updatedOrder.orderType)

    //For basic to premium upgrade, subscription starts today.
    //For premium renewal, if plan has not expired yet, add on the current expiry date
    const subscriptionStartDate =
      agencyDetails.subscriptionPlan === SubscriptionPlanEnum.BASIC
        ? new Date()
        : max([agencyDetails.subscriptionExpiresOn, new Date()])

    //Calculate new expiry date based on order type
    const newSubscriptionExpiryDate = addDays(
      subscriptionStartDate,
      orderSubscriptionDays,
    )

    await agencyRepository.updateAgencySubscriptionWithOrder({
      id: updatedOrder.agencyId,
      subscriptionPlan: SubscriptionPlanEnum.PREMIUM,
      subscriptionExpiresOn: newSubscriptionExpiryDate,
      latestPaidOrderId: updatedOrder.id,
    })

    return updatedOrder
  },

  async confirmOrderWebhookStatus(orderId: string) {
    return await orderRepository.updateOrderWebhookConfirmed(orderId)
  },

  async addInvoiceUrlAndEmailSentTime({
    orderId,
    orderInvoiceUrl,
    orderEmailSentAt,
  }: {
    orderId: string
    orderInvoiceUrl: string
    orderEmailSentAt: Date | null
  }) {
    await orderRepository.updateInvoiceUrlAndEmailSentTime({
      orderId,
      orderInvoiceUrl,
      orderEmailSentAt,
    })
  },
}

function getSubscriptionDays(orderType: OrderTypeEnum) {
  if (orderType === OrderTypeEnum.ANNUAL) return ANNUAL_SUBSCRIPTION_DAYS
  if (orderType === OrderTypeEnum.QUARTERLY) return QUARTERLY_SUBSCRIPTION_DAYS
  return MONTHLY_SUBSCRIPTION_DAYS
}

export type FindAllOrdersByAgencyIdType = Awaited<
  ReturnType<typeof orderServices.findAllOrdersByAgencyId>
>
export type FindAllOrdersByUserIdType = Awaited<
  ReturnType<typeof orderServices.findAllOrdersByUserId>
>
export type FindOrderByRPIdType = Awaited<
  ReturnType<typeof orderServices.findOrderByRPId>
>

export type FindLastPaidOrderType = Awaited<
  ReturnType<typeof orderServices.findLastPaidOrder>
>
export type FindExistingOrderType = Awaited<
  ReturnType<typeof orderServices.findExistingCreatedOrder>
>

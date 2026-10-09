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
    const orders = await orderRepository.readAllOrdersByAgencyId(agencyId)
    return orders
  },
  async findAllOrdersByUserId(userId: string) {
    const orders = await orderRepository.readAllOrdersByUserId(userId)
    return orders
  },

  async findOrderByRPId(rpOrderId: string) {
    const order = await orderRepository.readOrderByRPId(rpOrderId)
    return order
  },

  async findLastPaidOrder(agencyId: string) {
    const order = await orderRepository.readAgencyLatestOrderByStatus({
      agencyId,
      status: OrderStatusEnum.PAID,
    })
    return order
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
    const order = await orderRepository.readOrderByRPId(rpOrderId)
    if (!order) return

    const agency = await agencyRepository.readAgencyById(order.agencyId)
    if (!agency) return

    //If already paid and webhook confirmed, do nothing
    if (order.status === OrderStatusEnum.PAID && order.isWebhookConfirmed)
      return

    //Update order in DB
    const [updatedOrder] = await orderRepository.updateOrderStatusbyRPId({
      rpOrderId,
      status: OrderStatusEnum.PAID,
      isWebhookConfirmed,
      attempts,
    })
    // If for some reason, order update failed, should we proceed with subscription upgrade?
    // -> NO (Confirm in bank account first and then manually upgrade)
    if (!updatedOrder) return

    //If it was already paid, return now (no need to upgrade subscription again)
    if (order.status === OrderStatusEnum.PAID) return

    //Trigger subscription upgrade
    const orderSubscriptionDays = getSubscriptionDays(order.orderType)

    //For basic to premium upgrade, subscription starts today.
    //For premium renewal, if plan has not expired yet, add on the current expiry date
    const subscriptionStartDate =
      agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
        ? new Date()
        : max([agency.subscriptionExpiresOn, new Date()])

    //Calculate new expiry date based on order type
    const newSubscriptionExpiryDate = addDays(
      subscriptionStartDate,
      orderSubscriptionDays,
    )

    await agencyRepository.updateAgencySubscriptionWithOrder({
      id: order.agencyId,
      subscriptionPlan: SubscriptionPlanEnum.PREMIUM,
      subscriptionExpiresOn: newSubscriptionExpiryDate,
      latestPaidOrderId: order.id,
    })

    return updatedOrder
  },

  async confirmOrderWebhookStatus(orderId: string) {
    const [updatedOrder] =
      await orderRepository.updateOrderWebhookConfirmed(orderId)
    return updatedOrder
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

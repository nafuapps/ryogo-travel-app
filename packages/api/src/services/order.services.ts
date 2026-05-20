import {
  OrderStatusEnum,
  OrderTypeEnum,
  SubscriptionPlanEnum,
} from "@ryogo-travel-app/db/schema"
import { orderRepository } from "../repositories/order.repo"
import {
  ANNUAL_SUBSCRIPTION_DAYS,
  ANNUAL_SUBSCRIPTION_FINAL_PRICE,
  EXISTING_ORDER_SEARCH_HOURS,
  MONTHLY_SUBSCRIPTION_DAYS,
  MONTHLY_SUBSCRIPTION_FINAL_PRICE,
  QUARTERLY_SUBSCRIPTION_DAYS,
  QUARTERLY_SUBSCRIPTION_FINAL_PRICE,
} from "../apiConfig"
import { agencyRepository } from "../repositories/agency.repo"

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
    return await orderRepository.readAgencyLatestOrderByStatus(
      agencyId,
      OrderStatusEnum.PAID,
    )
  },

  async findExistingCreatedOrder(
    agencyId: string,
    userId: string,
    plan: OrderTypeEnum,
  ) {
    const existingOrder = await orderRepository.readOrderCreatedRange(
      agencyId,
      userId,
      plan,
      EXISTING_ORDER_SEARCH_HOURS,
    )
    return existingOrder
  },

  getAmountByPlan(plan: OrderTypeEnum) {
    if (plan === OrderTypeEnum.ANNUAL) {
      return ANNUAL_SUBSCRIPTION_FINAL_PRICE
    }
    if (plan === OrderTypeEnum.QUARTERLY) {
      return QUARTERLY_SUBSCRIPTION_FINAL_PRICE
    }
    return MONTHLY_SUBSCRIPTION_FINAL_PRICE
  },

  async addOrder(
    agencyId: string,
    userId: string,
    amount: number,
    rpOrderId: string,
  ) {
    const order = await orderRepository.createOrder({
      agencyId: agencyId,
      userId: userId,
      amount: amount,
      rpOrderId: rpOrderId,
      status: OrderStatusEnum.CREATED,
    })
    if (!order || order.length < 1) return
    return order[0]
  },

  async changeOrderToAttempted(rpOrderId: string) {
    const order = await orderRepository.updateOrderStatusbyRPId(
      rpOrderId,
      OrderStatusEnum.ATTEMPTED,
      false,
    )
    //Future: Give grace period for attempt
    return order[0]
  },

  async changeOrderToPaid(
    rpOrderId: string,
    isWebhookConfirmed: boolean,
    attempts?: number,
  ) {
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
    const updatedOrder = await orderRepository.updateOrderStatusbyRPId(
      rpOrderId,
      OrderStatusEnum.PAID,
      isWebhookConfirmed,
      attempts,
    )
    // If for some reason, order update failed, should we proceed with subscription upgrade? -> NO
    if (!updatedOrder[0]) return

    //If it was already paid, return now
    if (orderDetails.status === OrderStatusEnum.PAID) return

    //Trigger subscription upgrade
    const orderType = updatedOrder[0].orderType

    let subscriptionDays = MONTHLY_SUBSCRIPTION_DAYS
    if (orderType === OrderTypeEnum.QUARTERLY) {
      subscriptionDays = QUARTERLY_SUBSCRIPTION_DAYS
    }
    if (orderType === OrderTypeEnum.ANNUAL) {
      subscriptionDays = ANNUAL_SUBSCRIPTION_DAYS
    }

    let startDate = new Date()

    //If premium subscription has not expired yet, extend from current expiry date
    if (
      agencyDetails.subscriptionPlan !== SubscriptionPlanEnum.BASIC &&
      agencyDetails.subscriptionExpiresOn > new Date()
    ) {
      startDate = agencyDetails.subscriptionExpiresOn
    }

    const newExpiryTime = new Date(
      startDate.getTime() + subscriptionDays * 24 * 60 * 60 * 1000,
    )
    await agencyRepository.updateAgencySubscription(
      updatedOrder[0].agencyId,
      SubscriptionPlanEnum.PREMIUM,
      newExpiryTime,
      updatedOrder[0].id,
    )
    return updatedOrder[0]
  },

  async confirmOrderWebhookStatus(id: string) {
    return await orderRepository.updateOrderWebhookConfirmed(id, true)
  },

  async addInvoiceUrlAndEmailSentTime(
    id: string,
    invoiceUrl: string,
    emailSentAt: Date | null,
  ) {
    await orderRepository.updateInvoiceUrlAndEmailSentTime(
      id,
      invoiceUrl,
      emailSentAt,
    )
  },
}

export type FindAllOrdersByAgencyIdType = Awaited<
  ReturnType<typeof orderServices.findAllOrdersByAgencyId>
>
export type FindAllOrdersByUserIdType = Awaited<
  ReturnType<typeof orderServices.findAllOrdersByUserId>
>
export type FindOrderByRPIdTypr = Awaited<
  ReturnType<typeof orderServices.findOrderByRPId>
>

export type FindLastPaidOrderType = Awaited<
  ReturnType<typeof orderServices.findLastPaidOrder>
>
export type FindExistingOrderType = Awaited<
  ReturnType<typeof orderServices.findExistingCreatedOrder>
>

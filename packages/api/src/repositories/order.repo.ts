import { db } from "@ryogo-travel-app/db"
import {
  InsertOrderType,
  orders,
  OrderStatusEnum,
  OrderTypeEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, and, gt } from "drizzle-orm"

export const orderRepository = {
  async readAllOrdersByAgencyId(agencyId: string) {
    return await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.updatedAt)],
      where: eq(orders.agencyId, agencyId),
      with: {
        payments: {
          orderBy: (payments, { desc }) => [desc(payments.createdAt)],
        },
        user: {
          columns: {
            name: true,
          },
        },
      },
    })
  },
  async readAllOrdersByUserId(userId: string) {
    return await db.query.orders.findMany({
      where: eq(orders.userId, userId),
    })
  },

  async readOrderByRPId(rpOrderId: string) {
    return await db.query.orders.findFirst({
      where: eq(orders.rpOrderId, rpOrderId),
    })
  },

  //Find latest order by status for an agency
  async readAgencyLatestOrderByStatus(
    agencyId: string,
    status: OrderStatusEnum,
  ) {
    return await db.query.orders.findFirst({
      orderBy: (orders, { desc }) => [desc(orders.updatedAt)],
      where: and(eq(orders.status, status), eq(orders.agencyId, agencyId)),
    })
  },

  //Find order created in last X hours
  async readOrderCreatedRange(
    agencyId: string,
    userId: string,
    plan: OrderTypeEnum,
    hours: number,
  ) {
    return await db.query.orders.findFirst({
      where: and(
        eq(orders.status, OrderStatusEnum.CREATED),
        eq(orders.orderType, plan),
        eq(orders.agencyId, agencyId),
        eq(orders.userId, userId),
        gt(orders.createdAt, new Date(Date.now() - hours * 60 * 60 * 1000)),
      ),
    })
  },

  async createOrder(order: InsertOrderType) {
    return await db.insert(orders).values(order).returning()
  },

  async updateOrderStatusbyRPId(
    rpOrderId: string,
    status: OrderStatusEnum,
    isWebhookConfirmed: boolean,
    attempts?: number,
  ) {
    return await db
      .update(orders)
      .set({ status, attempts, isWebhookConfirmed })
      .where(eq(orders.rpOrderId, rpOrderId))
      .returning()
  },

  async updateOrderWebhookConfirmed(id: string, isWebhookConfirmed: boolean) {
    return await db
      .update(orders)
      .set({ isWebhookConfirmed })
      .where(eq(orders.id, id))
      .returning()
  },

  async updateInvoiceUrlAndEmailSentTime(
    id: string,
    invoiceUrl: string,
    emailSentAt: Date | null,
  ) {
    return await db
      .update(orders)
      .set({ invoiceUrl, emailSentAt })
      .where(eq(orders.id, id))
      .returning()
  },
}

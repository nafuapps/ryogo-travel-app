import { db } from "@ryogo-travel-app/db"
import {
  InsertOrderType,
  orders,
  OrderStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, and } from "drizzle-orm"

export const orderRepository = {
  //get all orders
  async readAllOrders() {
    return await db.query.orders.findMany({})
  },

  async createOrder(order: InsertOrderType) {
    return await db.insert(orders).values(order).returning()
  },

  async updateOrder(rpOrderId: string, status: OrderStatusEnum) {
    return await db
      .update(orders)
      .set({ status: status })
      .where(eq(orders.rpOrderId, rpOrderId))
      .returning()
  },
}

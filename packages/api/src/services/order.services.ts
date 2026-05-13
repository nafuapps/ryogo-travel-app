import { OrderStatusEnum } from "@ryogo-travel-app/db/schema"
import { orderRepository } from "../repositories/order.repo"

export const orderServices = {
  //Find all orders
  async findAllOrders() {
    const orders = await orderRepository.readAllOrders()
    return orders
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

  async changeOrderToPaid(rpOrderId: string) {
    const order = await orderRepository.updateOrder(
      rpOrderId,
      OrderStatusEnum.CAPTURED,
    )
    return order[0]
  },
}

export type FindAllOrdersType = Awaited<
  ReturnType<typeof orderServices.findAllOrders>
>

"use server"

import { customerServices } from "@ryogo-travel-app/api/services/customer.services"

export async function activateCustomerAction(id: string) {
  const customer = await customerServices.activateCustomer(id)
  if (!customer) return false
  return true
}

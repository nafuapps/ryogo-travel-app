"use server"

import { customerServices } from "@ryogo-travel-app/api/services/customer.services"

export async function inactivateCustomerAction(id: string) {
  const customer = await customerServices.inactivateCustomer(id)
  if (!customer) return false
  return true
}
